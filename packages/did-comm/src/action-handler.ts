import 'cross-fetch/polyfill'
import {
  IAgentContext,
  IResolver,
  IMessage,
  IDIDManager,
  IKeyManager,
  IMessageHandler,
  IAgentPlugin,
  IIdentifier,
} from '@veramo/core'
import {
  createAnonDecrypter,
  createAuthDecrypter,
  Decrypter,
  decryptJWE,
  JWE,
  ECDH,
  createAnonEncrypter,
  createJWE,
  createAuthEncrypter,
  Encrypter,
  verifyJWS,
} from 'did-jwt'
import { DIDDocument, parse as parseDidUrl, VerificationMethod } from 'did-resolver'
import { schema } from './'
import { v4 as uuidv4 } from 'uuid'
import * as u8a from 'uint8arrays'
import { convertPublicKeyToX25519 } from '@stablelib/ed25519'
import {
  isDefined,
  mapIdentifierKeysToDoc,
  encodeJoseBlob,
  createEcdhWrapper,
  resolveDidOrThrow,
  dereferenceDidKeys,
  decodeJoseBlob,
  extractSenderEncryptionKey,
  extractManagedRecipients,
  mapRecipientsToLocalKeys,
} from './utils'

import Debug from 'debug'
import { IDIDComm } from './types/IDIDComm'
import {
  DIDCommMessageMediaType,
  DIDCommMessagePacking,
  IDIDCommMessage,
  IPackedDIDCommMessage,
  IUnpackedDIDCommMessage,
} from './types/message-types'
import {
  _DIDCommEncryptedMessage,
  _DIDCommPlainMessage,
  _DIDCommSignedMessage,
  _ExtendedIKey,
  _FlattenedJWS,
  _GenericJWS,
  _NormalizedVerificationMethod,
} from './types/utility-types'
const debug = Debug('veramo:did-comm:action-handler')

/**
 * Input arguments for {@link IDIDComm.sendMessageDIDCommAlpha1}
 * @beta
 */
export interface ISendMessageDIDCommAlpha1Args {
  url?: string
  save?: boolean
  data: {
    id?: string
    from: string
    to: string
    type: string
    body: object | string
  }
  headers?: Record<string, string>
}

// interface arguments

/**
 * The input to the {@link DIDComm.unpackDIDCommMessage} method.
 * @beta
 */
export type IUnpackDIDCommMessageArgs = IPackedDIDCommMessage

/**
 * The input to the {@link DIDComm.packDIDCommMessage} method.
 * When `packing` is `authcrypt` or `jws`, a `keyRef` MUST be provided.
 * @beta
 */
export interface IPackDIDCommMessageArgs {
  message: IDIDCommMessage
  packing: DIDCommMessagePacking
  keyRef?: string
}

export interface IDIDCommTransport {
  id: string
  // FIXME: TODO: other potential stuff

  // sendRawMessage(args: xyz, context: xyz)
}

export interface ISendDIDCommMessageArgs {
  packedMessage: IPackedDIDCommMessage
  returnTransport?: IDIDCommTransport
  recipientDID: string
}

export interface ISendDIDCommMessageResult {
  sent?: boolean
  error?: string
}

/**
 * DID Comm plugin for {@link @veramo/core#Agent}
 *
 * This plugin provides a method of creating an encrypted message according to the initial {@link https://github.com/decentralized-identifier/DIDComm-js | DIDComm-js} implementation.
 *
 * @remarks Be advised that this spec is still not final and that this protocol may need to change.
 *
 * @beta
 */
export class DIDComm implements IAgentPlugin {
  /** Plugin methods */
  readonly methods: IDIDComm
  readonly schema = schema.IDIDComm

  constructor() {
    this.methods = {
      sendMessageDIDCommAlpha1: this.sendMessageDIDCommAlpha1.bind(this),
      getDIDCommMessageMediaType: this.getDidCommMessageMediaType.bind(this),
      unpackDIDCommMessage: this.unpackDIDCommMessage.bind(this),
      packDIDCommMessage: this.packDIDCommMessage.bind(this),
      sendDIDCommMessage: this.sendDIDCommMessage.bind(this),
    }
  }

  /** {@inheritdoc IDIDComm.packDIDCommMessage} */
  async packDIDCommMessage(
    args: IPackDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver>,
  ): Promise<IPackedDIDCommMessage> {
    switch (args.packing) {
      case 'authcrypt': // intentionally omitting break
      case 'anoncrypt':
        return this.packDIDCommMessageJWE(args, context)
      case 'none':
        const message = {
          ...args.message,
          typ: DIDCommMessageMediaType.PLAIN,
        }
        return { message: JSON.stringify(message) }
      case 'jws':
        return this.packDIDCommMessageJWS(args, context)
      default:
        throw new Error(`not_implemented: packing messages as ${args.packing} is not supported yet`)
    }
  }

  private async packDIDCommMessageJWS(
    args: IPackDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver>,
  ): Promise<IPackedDIDCommMessage> {
    const message = args.message
    let keyRef: string | undefined = args.keyRef
    let kid: string
    // check that the message has from field that is managed
    let managedSender: IIdentifier | undefined
    try {
      managedSender = await context.agent.didManagerGet({ did: message.from || '' })
    } catch (e) {
      debug(`message.from(${message.from}) is not managed by this agent`)
    }
    if (!message.from || !isDefined(managedSender)) {
      throw new Error('invalid_argument: `from` field must be a DID managed by this agent')
    }

    // obtain sender signing key(s) from authentication section
    const senderKeys = await mapIdentifierKeysToDoc(managedSender, 'authentication', context)
    // try to find a managed signing key that matches keyRef
    let signingKey = null
    if (isDefined(keyRef)) {
      signingKey = senderKeys.find((key) => key.kid === keyRef || key.meta.verificationMethod.id === keyRef)
    }
    // otherwise use the first available one.
    signingKey = signingKey ? signingKey : senderKeys[0]

    if (!signingKey) {
      throw new Error(`key_not_found: could not locate a suitable signing key for ${message.from}`)
    } else {
      kid = signingKey.meta.verificationMethod.id
    }
    let alg: string
    if (signingKey.type === 'Ed25519') {
      alg = 'EdDSA'
    } else if (signingKey.type === 'Secp256k1') {
      alg = 'ES256K'
    } else {
      throw new Error(
        `not_supported: key of type ${signingKey.type} is not supported for JWS didcomm message`,
      )
    }
    // construct the protected header with alg, typ and kid
    const headerObj = { alg, kid, typ: DIDCommMessageMediaType.SIGNED }
    const header = encodeJoseBlob(headerObj)
    const payload = encodeJoseBlob(args.message)
    // construct signing input and obtain signature
    const signingInput = header + '.' + payload
    const signature: string = await context.agent.keyManagerSign({
      data: signingInput,
      encoding: 'utf-8',
      keyRef: signingKey.kid,
      algorithm: alg,
    })
    // create flattened JWS
    const packedMessage = {
      protected: header,
      payload,
      signature,
    }
    // serialize flattened JWS JSON and return
    return { message: JSON.stringify(packedMessage) }
  }

  private async packDIDCommMessageJWE(
    args: IPackDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver>,
  ): Promise<IPackedDIDCommMessage> {
    // 1. check if args.packing requires authentication and map sender key to skid
    let senderECDH: ECDH | null = null
    let keyRef: string | undefined = args.keyRef
    let protectedHeader: {
      skid?: string
      typ: string
    } = {
      typ: DIDCommMessageMediaType.ENCRYPTED,
    }
    if (args.packing === 'authcrypt') {
      // TODO: what to do about from_prior?
      if (!args?.message?.from) {
        throw new Error(
          `invalid_argument: cannot create authenticated did-comm message without a 'from' field`,
        )
      }
      //    1.1 check that args.message.from is a managed DID
      const sender: IIdentifier = await context.agent.didManagerGet({ did: args?.message?.from })
      //    1.2 match key agreement keys from DID to managed keys
      const senderKeys: _ExtendedIKey[] = await mapIdentifierKeysToDoc(sender, 'keyAgreement', context)
      // try to find a sender key by keyRef, otherwise pick the first one
      let senderKey
      if (isDefined(keyRef)) {
        senderKey = senderKeys.find((key) => key.kid === keyRef || key.meta.verificationMethod.id === keyRef)
      }
      senderKey = senderKey || senderKeys[0]
      //    1.3 use kid from DID doc(skid) + local IKey to bundle a sender key
      if (senderKey) {
        senderECDH = createEcdhWrapper(senderKey.kid, context)
        protectedHeader = { ...protectedHeader, skid: senderKey.meta.verificationMethod.id }
      } else {
        throw new Error(`key_not_found: could not map an agent key to an skid for ${args?.message?.from}`)
      }
    }

    // 2. resolve DID for args.message.to
    const didDocument: DIDDocument = await resolveDidOrThrow(args?.message?.to, context)

    // 2.1 extract all recipient key agreement keys and normalize them
    const keyAgreementKeys: _NormalizedVerificationMethod[] = await dereferenceDidKeys(
      didDocument,
      'keyAgreement',
      context,
    )

    // 2.2 get public key bytes and key IDs for supported recipient keys
    const recipients: { kid: string; publicKeyBytes: Uint8Array }[] = keyAgreementKeys
      .map((pk) => ({ kid: pk.id, publicKeyBytes: u8a.fromString(pk.publicKeyHex!, 'base16') }))
      .filter(isDefined)

    // 3. create Encrypter for each recipient
    const encrypters: Encrypter[] = recipients.map((recipient) => {
      if (args.packing === 'authcrypt') {
        return createAuthEncrypter(recipient.publicKeyBytes, <ECDH>senderECDH, { kid: recipient.kid })
      } else {
        return createAnonEncrypter(recipient.publicKeyBytes, { kid: recipient.kid })
      }
    })

    // 4. createJWE
    const messageBytes = u8a.fromString(JSON.stringify(args.message), 'utf-8')
    const jwe = await createJWE(messageBytes, encrypters, protectedHeader)
    const message = JSON.stringify(jwe)
    return { message }
  }

  /** {@inheritdoc IDIDComm.getDIDCommMessageMediaType} */
  async getDidCommMessageMediaType({ message }: IPackedDIDCommMessage): Promise<DIDCommMessageMediaType> {
    try {
      const { mediaType } = this.decodeMessageAndMediaType(message)
      return mediaType
    } catch (e) {
      debug(`Could not parse message as DIDComm v2 message: ${e}`)
      throw e
    }
  }

  /** {@inheritdoc IDIDComm.unpackDIDCommMessage} */
  async unpackDIDCommMessage(
    args: IUnpackDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver & IMessageHandler>,
  ): Promise<IUnpackedDIDCommMessage> {
    const { msgObj, mediaType } = this.decodeMessageAndMediaType(args.message)
    if (mediaType === DIDCommMessageMediaType.SIGNED) {
      return this.unpackDIDCommMessageJWS(msgObj as _DIDCommSignedMessage, context)
    } else if (mediaType === DIDCommMessageMediaType.PLAIN) {
      return { message: <IDIDCommMessage>msgObj, metaData: { packing: 'none' } }
    } else if (mediaType === DIDCommMessageMediaType.ENCRYPTED) {
      return this.unpackDIDCommMessageJWE({ jwe: msgObj as JWE }, context)
    } else {
      throw Error('not_supported: ' + mediaType)
    }
  }

  private async unpackDIDCommMessageJWS(
    jws: _DIDCommSignedMessage,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver>,
  ): Promise<IUnpackedDIDCommMessage> {
    // TODO: currently only supporting one signature
    const signatureEncoded: string = isDefined((<_FlattenedJWS>jws).signature)
      ? (<_FlattenedJWS>jws).signature
      : (<_GenericJWS>jws).signatures[0]?.signature
    const headerEncoded = isDefined((<_FlattenedJWS>jws).protected)
      ? (<_FlattenedJWS>jws).protected
      : (<_GenericJWS>jws).signatures[0]?.protected
    if (!isDefined(headerEncoded) || !isDefined(signatureEncoded)) {
      throw new Error('invalid_argument: could not interpret message as JWS')
    }
    const message = <IDIDCommMessage>decodeJoseBlob(jws.payload)
    const header = decodeJoseBlob(headerEncoded)
    const sender = parseDidUrl(header.kid)?.did
    if (!isDefined(sender) || sender !== message.from) {
      throw new Error('invalid_jws: sender is not a DID or does not match the `kid`')
    }
    const senderDoc = await resolveDidOrThrow(sender, context)
    const senderKey = (await context.agent.getDIDComponentById({
      didDocument: senderDoc,
      didUrl: header.kid,
      section: 'authentication',
    })) as VerificationMethod
    const verifiedSenderKey = verifyJWS(`${headerEncoded}.${jws.payload}.${signatureEncoded}`, senderKey)
    if (isDefined(verifiedSenderKey)) {
      return { message, metaData: { packing: 'jws' } }
    } else {
      throw new Error('invalid_jws: sender `kid` could not be validated as the signer of the message')
    }
  }

  private async unpackDIDCommMessageJWE(
    { jwe }: { jwe: JWE },
    context: IAgentContext<IDIDManager & IKeyManager & IResolver>,
  ): Promise<IUnpackedDIDCommMessage> {
    // 0 resolve skid to DID doc
    //   - find skid in DID doc and convert to 'X25519' byte array (if type matches)
    let senderKeyBytes: Uint8Array | null = await extractSenderEncryptionKey(jwe, context)

    // 1. check whether kid is one of my DID URIs
    //   - get recipient DID URIs
    //   - extract DIDs from recipient DID URIs
    //   - match DIDs against locally managed DIDs
    let managedRecipients = await extractManagedRecipients(jwe, context)

    // 2. get internal IKey instance for each recipient.kid
    //   - resolve locally managed DIDs that match recipients
    //   - filter to the keyAgreementKeys that match the recipient.kid
    //   - match identifier.keys.publicKeyHex to (verificationMethod.publicKey*)
    //   - return a list of `IKey`
    const localKeys = await mapRecipientsToLocalKeys(managedRecipients, context)

    // 3. for each recipient
    //  if isAuthcrypted? (if senderKey != null)
    //   - construct auth decrypter
    //  else
    //   - construct anon decrypter
    for (const localKey of localKeys) {
      let packing: string
      let decrypter: Decrypter
      const recipientECDH: ECDH = createEcdhWrapper(localKey.localKeyRef, context)
      // TODO: here's where more algorithms should be supported
      if (senderKeyBytes && localKey.recipient?.header?.alg?.includes('ECDH-1PU')) {
        decrypter = createAuthDecrypter(recipientECDH, senderKeyBytes)
        packing = 'authcrypt'
      } else {
        decrypter = createAnonDecrypter(recipientECDH)
        packing = 'anoncrypt'
      }
      // 4. decryptJWE(jwe, decrypter)
      try {
        const decryptedBytes = await decryptJWE(jwe, decrypter)
        const decryptedMsg = u8a.toString(decryptedBytes, 'utf-8')
        const message = JSON.parse(decryptedMsg)
        return { message, metaData: { packing } } as IUnpackedDIDCommMessage
      } catch (e) {
        debug(
          `unable to decrypt DIDComm msg using ${localKey.localKeyRef} (${localKey.recipient.header.kid})`,
        )
      }
    }

    throw new Error('unable to decrypt DIDComm message with any of the locally managed keys')
  }

  private decodeMessageAndMediaType(message: string): {
    msgObj: _DIDCommPlainMessage | _DIDCommSignedMessage | _DIDCommEncryptedMessage
    mediaType: DIDCommMessageMediaType
  } {
    let msgObj
    if (typeof message === 'string') {
      try {
        msgObj = JSON.parse(message)
      } catch (e) {
        throw new Error('invalid_argument: unable to parse message as JSON')
        // TODO: try to interpret as compact serialized JWS / JWM?
      }
    } else {
      msgObj = message
    }
    let mediaType: DIDCommMessageMediaType | null = null
    if ((<_DIDCommPlainMessage>msgObj).typ === DIDCommMessageMediaType.PLAIN) {
      mediaType = DIDCommMessageMediaType.PLAIN
    } else if ((<_FlattenedJWS | _DIDCommEncryptedMessage>msgObj).protected) {
      const protectedHeader = decodeJoseBlob(msgObj.protected)
      if (protectedHeader.typ === DIDCommMessageMediaType.SIGNED) {
        mediaType = DIDCommMessageMediaType.SIGNED
      } else if (protectedHeader.typ === DIDCommMessageMediaType.ENCRYPTED) {
        mediaType = DIDCommMessageMediaType.ENCRYPTED
      } else {
        throw new Error('invalid_argument: unable to determine message type')
      }
    } else if ((<_GenericJWS>msgObj).signatures) {
      mediaType = DIDCommMessageMediaType.SIGNED
    } else {
      throw new Error('invalid_argument: unable to determine message type')
    }
    return { msgObj, mediaType }
  }

  /** {@inheritdoc IDIDComm.sendDIDCommMessage} */
  async sendDIDCommMessage(
    args: ISendDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver & IMessageHandler>,
  ): Promise<ISendDIDCommMessageResult> {
    const { packedMessage, returnTransport, recipientDID } = args
    // let transport: IDIDCommTransport
    if (returnTransport) {
      // FIXME: TODO: transport handling
      // check if previous message was ok with reusing transport?
      // if so, retrieve transport from transport manager
      // transport = this.transports.get(returnTransport.id)
    } else {
      // FIXME: TODO: get transport for recipientDID
      // resolve(recipientDID)
      // get service block
      // get transport for service block
    }

    // transport.sendRawMessage(...)

    throw Error('FIXME: TODO: sendDIDCommMessage not implemented yet')
  }

  /** {@inheritdoc IDIDComm.sendMessageDIDCommAlpha1} */
  async sendMessageDIDCommAlpha1(
    args: ISendMessageDIDCommAlpha1Args,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver & IMessageHandler>,
  ): Promise<IMessage> {
    const { data, url, headers, save = true } = args

    debug('Resolving didDoc')
    const didDoc = (await context.agent.resolveDid({ didUrl: data.to })).didDocument
    let serviceEndpoint
    if (url) {
      serviceEndpoint = url
    } else {
      const service = didDoc && didDoc.service && didDoc.service.find((item) => item.type == 'Messaging')
      serviceEndpoint = service?.serviceEndpoint
    }

    if (serviceEndpoint) {
      try {
        data.id = data.id || uuidv4()
        let postPayload = JSON.stringify(data)
        try {
          const identifier = await context.agent.didManagerGet({ did: data.from })
          const key = identifier.keys.find((k) => k.type === 'Ed25519')
          if (!key) throw Error('No encryption key')
          const publicKey = didDoc?.publicKey?.find((item) => item.type == 'Ed25519VerificationKey2018')
          if (!publicKey?.publicKeyHex) throw Error('Recipient does not have encryption publicKey')

          postPayload = await context.agent.keyManagerEncryptJWE({
            kid: key.kid,
            to: {
              type: 'Ed25519',
              publicKeyHex: publicKey?.publicKeyHex,
              kid: publicKey?.publicKeyHex,
            },
            data: postPayload,
          })

          debug('Encrypted:', postPayload)
        } catch (e) {}

        debug('Sending to %s', serviceEndpoint)
        const res = await fetch(serviceEndpoint, {
          method: 'POST',
          body: postPayload,
          headers,
        })
        debug('Status', res.status, res.statusText)

        if (res.status == 200) {
          return await context.agent.handleMessage({
            raw: JSON.stringify(data),
            metaData: [{ type: 'DIDComm-sent' }],
            save,
          })
        }

        return Promise.reject(new Error('Message not sent'))
      } catch (e) {
        return Promise.reject(e)
      }
    } else {
      debug('No Messaging service in didDoc')
      return Promise.reject(new Error('No service endpoint'))
    }
  }
}
