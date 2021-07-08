import { AbstractKeyStore } from './abstract-key-store'
import { AbstractKeyManagementSystem } from './abstract-key-management-system'
import {
  IKey,
  IKeyManager,
  IAgentPlugin,
  IKeyManagerCreateArgs,
  IKeyManagerGetArgs,
  IKeyManagerDeleteArgs,
  IKeyManagerEncryptJWEArgs,
  IKeyManagerDecryptJWEArgs,
  IKeyManagerSignJWTArgs,
  IKeyManagerSignEthTXArgs,
  schema,
  IKeyManagerSignArgs,
  IKeyManagerSharedSecretArgs,
  TKeyType,
} from '@veramo/core'
import * as u8a from 'uint8arrays'
import { JWE, createAnonDecrypter, createAnonEncrypter, createJWE, decryptJWE, ECDH } from 'did-jwt'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { toUtf8String, toUtf8Bytes } from '@ethersproject/strings'
import { convertPublicKeyToX25519 } from '@stablelib/ed25519'

/**
 * Agent plugin that provides {@link @veramo/core#IKeyManager} methods
 * @public
 */
export class KeyManager implements IAgentPlugin {
  /**
   * Plugin methods
   * @public
   */
  readonly methods: IKeyManager

  readonly schema = schema.IKeyManager

  private store: AbstractKeyStore
  private kms: Record<string, AbstractKeyManagementSystem>

  constructor(options: { store: AbstractKeyStore; kms: Record<string, AbstractKeyManagementSystem> }) {
    this.store = options.store
    this.kms = options.kms
    this.methods = {
      keyManagerGetKeyManagementSystems: this.keyManagerGetKeyManagementSystems.bind(this),
      keyManagerCreate: this.keyManagerCreate.bind(this),
      keyManagerGet: this.keyManagerGet.bind(this),
      keyManagerDelete: this.keyManagerDelete.bind(this),
      keyManagerImport: this.keyManagerImport.bind(this),
      keyManagerEncryptJWE: this.keyManagerEncryptJWE.bind(this),
      keyManagerDecryptJWE: this.keyManagerDecryptJWE.bind(this),
      keyManagerSignJWT: this.keyManagerSignJWT.bind(this),
      keyManagerSignEthTX: this.keyManagerSignEthTX.bind(this),
      keyManagerSign: this.keyManagerSign.bind(this),
      keyManagerSharedSecret: this.keyManagerSharedSecret.bind(this),
    }
  }

  private getKms(name: string): AbstractKeyManagementSystem {
    const kms = this.kms[name]
    if (!kms) throw Error('KMS does not exist: ' + name)
    return kms
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerGetKeyManagementSystems} */
  async keyManagerGetKeyManagementSystems(): Promise<Array<string>> {
    return Object.keys(this.kms)
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerCreate} */
  async keyManagerCreate(args: IKeyManagerCreateArgs): Promise<IKey> {
    const kms = this.getKms(args.kms)
    const partialKey = await kms.createKey({ type: args.type, meta: args.meta })
    const key: IKey = { ...partialKey, kms: args.kms }
    if (args.meta || key.meta) {
      key.meta = { ...args.meta, ...key.meta }
    }
    await this.store.import(key)
    if (key.privateKeyHex) {
      delete key.privateKeyHex
    }
    return key
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerGet} */
  async keyManagerGet({ kid }: IKeyManagerGetArgs): Promise<IKey> {
    return this.store.get({ kid })
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerDelete} */
  async keyManagerDelete({ kid }: IKeyManagerDeleteArgs): Promise<boolean> {
    const key = await this.store.get({ kid })
    const kms = this.getKms(key.kms)
    await kms.deleteKey({ kid })
    return this.store.delete({ kid })
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerImport} */
  async keyManagerImport(key: IKey): Promise<boolean> {
    //FIXME: check proper key properties and ask the actual KMS to import and fill in the missing meta data
    return this.store.import(key)
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerEncryptJWE} */
  async keyManagerEncryptJWE({ kid, to, data }: IKeyManagerEncryptJWEArgs): Promise<string> {
    // TODO: if a sender `key` is provided, then it should be used to create an authenticated encrypter
    // const key = await this.store.get({ kid })

    let recipientPublicKey: Uint8Array
    if (to.type === 'Ed25519') {
      recipientPublicKey = arrayify('0x' + to.publicKeyHex)
      recipientPublicKey = convertPublicKeyToX25519(recipientPublicKey)
    } else if (to.type === 'X25519') {
      recipientPublicKey = arrayify('0x' + to.publicKeyHex)
    } else {
      throw new Error('not_supported: The recipient public key type is not supported')
    }

    const dataBytes = toUtf8Bytes(data)
    const encrypter = createAnonEncrypter(recipientPublicKey)
    const result: JWE = await createJWE(dataBytes, [encrypter])

    return JSON.stringify(result)
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerDecryptJWE} */
  async keyManagerDecryptJWE({ kid, data }: IKeyManagerDecryptJWEArgs): Promise<string> {
    const jwe: JWE = JSON.parse(data)
    const ecdh = this.createX25519ECDH(kid)

    // TODO: figure out if the JWE is anon or not to determine the type of decrypter to use
    const decrypter = createAnonDecrypter(ecdh)

    const decrypted = await decryptJWE(jwe, decrypter)
    const result = toUtf8String(decrypted)
    return result
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerSignJWT} */
  async keyManagerSignJWT({ kid, data }: IKeyManagerSignJWTArgs): Promise<string> {
    const key = await this.store.get({ kid })
    const kms = this.getKms(key.kms)
    return kms.signJWT({ key, data })
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerSign} */
  async keyManagerSign(args: IKeyManagerSignArgs): Promise<string> {
    const { keyRef, data, algorithm, encoding, ...extras } = { encoding: 'utf-8', ...args }
    const key = await this.store.get({ kid: keyRef })
    let dataBytes
    if (typeof data === 'string') {
      if (encoding === 'base16' || encoding === 'hex') {
        const preData = data.startsWith('0x') ? data.substring(2) : data
        dataBytes = u8a.fromString(preData, 'base16')
      } else {
        dataBytes = u8a.fromString(data, <'utf-8'>encoding)
      }
    } else {
      dataBytes = data
    }
    const kms = this.getKms(key.kms)
    return kms.sign({ key, algorithm, data: dataBytes, ...extras })
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerSignEthTX} */
  async keyManagerSignEthTX({ kid, transaction }: IKeyManagerSignEthTXArgs): Promise<string> {
    const key = await this.store.get({ kid })
    const kms = this.getKms(key.kms)
    return kms.signEthTX({ key, transaction })
  }

  /** {@inheritDoc @veramo/core#IKeyManager.keyManagerSharedKey} */
  async keyManagerSharedSecret(args: IKeyManagerSharedSecretArgs): Promise<string> {
    const { secretKeyRef, publicKey } = args
    const myKey = await this.store.get({ kid: secretKeyRef })
    const theirKey = publicKey
    if (
      myKey.type === theirKey.type ||
      (['Ed25519', 'X25519'].includes(myKey.type) && ['Ed25519', 'X25519'].includes(theirKey.type))
    ) {
    } else {
      throw new Error('invalid_argument: the key types have to match to be able to compute a shared secret')
    }
    const kms = this.getKms(myKey.kms)
    return kms.sharedSecret({ myKey, theirKey })
  }

  createX25519ECDH(secretKeyRef: string): ECDH {
    return async (theirPublicKey: Uint8Array): Promise<Uint8Array> => {
      if (theirPublicKey.length !== 32) {
        throw new Error('invalid_argument: incorrect publicKey key length for X25519')
      }
      const publicKey = { type: <TKeyType>'X25519', publicKeyHex: hexlify(theirPublicKey).substring(2) }
      const shared = await this.keyManagerSharedSecret({ secretKeyRef, publicKey })
      return arrayify('0x' + shared)
    }
  }
}
