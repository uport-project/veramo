import { IPluginMethodMap } from './IAgent'
import { TKeyType, IKey, KeyMetadata } from './IIdentifier'

/**
 * Input arguments for {@link IKeyManager.keyManagerCreate | keyManagerCreate}
 * @public
 */
export interface IKeyManagerCreateArgs {
  /**
   * Key type
   */
  type: TKeyType

  /**
   * Key Management System
   */
  kms: string

  /**
   * Optional. Key meta data
   */
  meta?: KeyMetadata
}

/**
 * Input arguments for {@link IKeyManager.keyManagerGet | keyManagerGet}
 * @public
 */
export interface IKeyManagerGetArgs {
  /**
   * Key ID
   */
  kid: string
}

/**
 * Input arguments for {@link IKeyManager.keyManagerDelete | keyManagerDelete}
 * @public
 */
export interface IKeyManagerDeleteArgs {
  /**
   * Key ID
   */
  kid: string
}

/**
 * Input arguments for {@link IKeyManager.keyManagerEncryptJWE | keyManagerEncryptJWE}
 * @beta
 */
export interface IKeyManagerEncryptJWEArgs {
  /**
   * Key ID to use for encryption
   */
  kid: string

  /**
   * Recipient key object
   */
  to: Omit<IKey, 'kms'>

  /**
   * Data to encrypt
   */
  data: string
}

/**
 * Input arguments for {@link IKeyManager.keyManagerDecryptJWE | keyManagerDecryptJWE}
 * @beta
 */
export interface IKeyManagerDecryptJWEArgs {
  /**
   * Key ID
   */
  kid: string

  /**
   * Encrypted data
   */
  data: string
}

/**
 * Input arguments for {@link IKeyManager.keyManagerSign | keyManagerSign}
 * @public
 */
export interface IKeyManagerSignArgs {
  /**
   * The key handle, as returned during `keyManagerCreateKey`
   */
  keyRef: string

  /**
   * The algorithm to use for signing.
   * This must be one of the algorithms supported by the KMS for this key type.
   *
   * The algorithm used here should match one of the names listed in `IKey.meta.algorithms`
   */
  algorithm?: string

  /**
   * Data to sign
   */
  data: string

  /**
   * If the data is a "string" then you can specify which encoding is used. Default is "utf-8"
   */
  encoding?: 'utf-8' | 'base16' | 'base64' | 'hex'

  [x: string]: any
}

/**
 * Input arguments for {@link IKeyManager.keyManagerSharedSecret | keyManagerSharedSecret}
 * @public
 */
export interface IKeyManagerSharedSecretArgs {
  /**
   * The secret key handle (`kid`)
   * as returned by {@link IKeyManager.keyManagerCreate | keyManagerCreate}
   */
  secretKeyRef: string

  /**
   * The public key of the other party.
   * The `type` of key MUST be compatible with the type referenced by `secretKeyRef`
   */
  publicKey: Pick<IKey, 'publicKeyHex' | 'type'>
}

/**
 * Input arguments for {@link IKeyManager.keyManagerSignJWT | keyManagerSignJWT}
 * @public
 */
export interface IKeyManagerSignJWTArgs {
  /**
   * Key ID
   */
  kid: string

  /**
   * Data to sign
   */
  data: string | Uint8Array
}

/**
 * Input arguments for {@link IKeyManager.keyManagerSignEthTX | keyManagerSignEthTX}
 * @public
 */
export interface IKeyManagerSignEthTXArgs {
  /**
   * Key ID
   */
  kid: string

  /**
   * Ethereum transaction object
   */
  transaction: object
}

/**
 * Key manager interface
 * @public
 */
export interface IKeyManager extends IPluginMethodMap {
  /**
   * Lists available key management systems
   */
  keyManagerGetKeyManagementSystems(): Promise<Array<string>>

  /**
   * Creates and returns a new key
   */
  keyManagerCreate(args: IKeyManagerCreateArgs): Promise<IKey>

  /**
   * Returns an existing key
   */
  keyManagerGet(args: IKeyManagerGetArgs): Promise<IKey>

  /**
   * Deletes a key
   */
  keyManagerDelete(args: IKeyManagerDeleteArgs): Promise<boolean>

  /**
   * Imports a created key
   */
  keyManagerImport(args: IKey): Promise<boolean>

  /**
   * Generates a signature according to the algorithm specified.
   * @throws `Error("not_supported")` if the KMS does not support the operation or if the key does not match the algorithm.
   * @param args
   */
  keyManagerSign(args: IKeyManagerSignArgs): Promise<string>

  /**
   * Compute a shared secret with the public key of another party.
   *
   * This computes the raw shared secret (the result of a Diffie-Hellman computation)
   * To use this for symmetric encryption you MUST apply a KDF on the result.
   *
   * @param args {@link IKeyManagerSharedKeyArgs}
   * @returns a `Promise` that resolves to a hex encoded shared secret
   */
  keyManagerSharedSecret(args: IKeyManagerSharedSecretArgs): Promise<string>

  /**
   * Encrypts data
   * @beta
   */
  keyManagerEncryptJWE(args: IKeyManagerEncryptJWEArgs): Promise<string>

  /**
   * Decrypts data
   * @beta
   */
  keyManagerDecryptJWE(args: IKeyManagerDecryptJWEArgs): Promise<string>

  /**
   * Signs JWT
   */
  keyManagerSignJWT(args: IKeyManagerSignJWTArgs): Promise<string>

  /** Signs Ethereum transaction */
  keyManagerSignEthTX(args: IKeyManagerSignEthTXArgs): Promise<string>
}
