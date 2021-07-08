import { convertPublicKeyToX25519, convertSecretKeyToX25519 } from '@stablelib/ed25519'
import {
  DIDDocumentSection,
  IAgentContext,
  IDIDManager,
  IIdentifier,
  IKey,
  IKeyManager,
  IResolver,
  TKeyType,
} from '@veramo/core'
import { ECDH, JWE } from 'did-jwt'
import { VerificationMethod, parse as parseDidUrl, DIDDocument } from 'did-resolver'
import * as u8a from 'uint8arrays'

import Debug from 'debug'
import {
  _ExtendedIKey,
  _ExtendedVerificationMethod,
  _NormalizedVerificationMethod,
} from './types/utility-types'
const debug = Debug('veramo:did-comm:action-handler')

export function bytesToBase64url(b: Uint8Array): string {
  return u8a.toString(b, 'base64url')
}

export function base64ToBytes(s: string): Uint8Array {
  const inputBase64Url = s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return u8a.fromString(inputBase64Url, 'base64url')
}

export function bytesToBase64(b: Uint8Array): string {
  return u8a.toString(b, 'base64pad')
}

export function encodeBase64url(s: string): string {
  return bytesToBase64url(u8a.fromString(s))
}

export function decodeBase64url(s: string): string {
  return u8a.toString(base64ToBytes(s))
}

export function encodeJoseBlob(payload: {}) {
  return u8a.toString(u8a.fromString(JSON.stringify(payload), 'utf-8'), 'base64url')
}

export function decodeJoseBlob(blob: string) {
  return JSON.parse(u8a.toString(u8a.fromString(blob, 'base64url'), 'utf-8'))
}

export function isDefined<T>(arg: T): arg is Exclude<T, null | undefined> {
  return typeof arg !== 'undefined'
}

export function createEcdhWrapper(secretKeyRef: string, context: IAgentContext<IKeyManager>): ECDH {
  return async (theirPublicKey: Uint8Array): Promise<Uint8Array> => {
    if (theirPublicKey.length !== 32) {
      throw new Error('invalid_argument: incorrect publicKey key length for X25519')
    }
    const publicKey = { type: <TKeyType>'X25519', publicKeyHex: u8a.toString(theirPublicKey, 'base16') }
    const shared = await context.agent.keyManagerSharedSecret({ secretKeyRef, publicKey })
    return u8a.fromString(shared, 'base16')
  }
}

export async function extractSenderEncryptionKey(
  jwe: JWE,
  context: IAgentContext<IResolver>,
): Promise<Uint8Array | null> {
  let senderKey: Uint8Array | null = null
  const protectedHeader = decodeJoseBlob(jwe.protected)
  if (typeof protectedHeader.skid === 'string') {
    const senderDoc = await resolveDidOrThrow(protectedHeader.skid, context)
    const sKey = (await context.agent.getDIDComponentById({
      didDocument: senderDoc,
      didUrl: protectedHeader.skid,
      section: 'keyAgreement',
    })) as _ExtendedVerificationMethod
    if (!['Ed25519VerificationKey2018', 'X25519KeyAgreementKey2019'].includes(sKey.type)) {
      throw new Error(`not_supported: sender key of type ${sKey.type} is not supported`)
    }
    let publicKeyHex = convertToPublicKeyHex(sKey, true)
    senderKey = u8a.fromString(publicKeyHex, 'base16')
  }
  return senderKey
}

export async function extractManagedRecipients(
  jwe: JWE,
  context: IAgentContext<IDIDManager>,
): Promise<{ recipient: any; kid: string; identifier: IIdentifier }[]> {
  const parsedDIDs = (jwe.recipients || [])
    .map((recipient) => {
      const kid = recipient?.header?.kid
      const did = parseDidUrl(kid || '')?.did as string
      if (kid && did) {
        return { recipient, kid, did }
      } else {
        return null
      }
    })
    .filter(isDefined)

  let managedRecipients = (
    await Promise.all(
      parsedDIDs.map(async ({ recipient, kid, did }) => {
        try {
          const identifier = await context.agent.didManagerGet({ did })
          return { recipient, kid, identifier }
        } catch (e) {
          // identifier not found, skip it
          return null
        }
      }),
    )
  ).filter(isDefined)
  return managedRecipients
}

export function convertIdentifierEncryptionKeys(identifier: IIdentifier): IKey[] {
  return identifier.keys
    .map((key) => {
      if (key.type === 'Ed25519') {
        const publicBytes = u8a.fromString(key.publicKeyHex, 'base16')
        key.publicKeyHex = u8a.toString(convertPublicKeyToX25519(publicBytes), 'base16')
        if (key.privateKeyHex) {
          const privateBytes = u8a.fromString(key.privateKeyHex)
          key.privateKeyHex = u8a.toString(convertSecretKeyToX25519(privateBytes), 'base16')
        }
        key.type = 'X25519'
      } else if (key.type !== 'X25519') {
        debug(`key of type ${key.type} is not supported for [de]encryption`)
        return null
      }
      return key
    })
    .filter(isDefined)
}

export async function mapRecipientsToLocalKeys(
  managedKeys: { recipient: any; kid: string; identifier: IIdentifier }[],
  context: IAgentContext<IResolver>,
): Promise<{ localKeyRef: string; recipient: any }[]> {
  const potentialKeys = await Promise.all(
    managedKeys.map(async ({ recipient, kid, identifier }) => {
      // TODO: use caching, since all recipients are supposed to belong to the same identifier
      const identifierKeys = await mapIdentifierKeysToDoc(identifier, 'keyAgreement', context)
      const localKey = identifierKeys.find((key) => key.meta.verificationMethod.id === kid)
      if (localKey) {
        return { localKeyRef: localKey.kid, recipient }
      } else {
        return null
      }
    }),
  )
  const localKeys = potentialKeys.filter(isDefined)
  return localKeys
}

export async function mapIdentifierKeysToDoc(
  identifier: IIdentifier,
  section: DIDDocumentSection = 'keyAgreement',
  context: IAgentContext<IResolver>,
): Promise<_ExtendedIKey[]> {
  const didDocument = await resolveDidOrThrow(identifier.did, context)

  // dereference all key agreement keys from DID document and normalize
  const keyAgreementKeys: _NormalizedVerificationMethod[] = await dereferenceDidKeys(
    didDocument,
    section,
    context,
  )

  let localKeys = identifier.keys
  if (section === 'keyAgreement') {
    localKeys = convertIdentifierEncryptionKeys(identifier)
  }
  // finally map the didDocument keys to the identifier keys by comparing `publicKeyHex`
  const extendedKeys: _ExtendedIKey[] = keyAgreementKeys
    .map((verificationMethod) => {
      const localKey = localKeys.find((localKey) => localKey.publicKeyHex === verificationMethod.publicKeyHex)
      if (localKey) {
        const { meta, ...localProps } = localKey
        return { ...localProps, meta: { ...meta, verificationMethod } }
      } else {
        return null
      }
    })
    .filter(isDefined)

  return extendedKeys
}

export async function resolveDidOrThrow(didUrl: string, context: IAgentContext<IResolver>) {
  // TODO: add caching
  const docResult = await context.agent.resolveDid({ didUrl: didUrl })
  const err = docResult.didResolutionMetadata.error
  const msg = docResult.didResolutionMetadata.message
  const didDocument = docResult.didDocument
  if (!isDefined(didDocument) || err) {
    throw new Error(`not_found: could not resolve DID document for '${didUrl}': ${err} ${msg}`)
  }
  return didDocument
}

/**
 * Dereferences key agreement keys from DID document and normalizes them for easy comparison.
 *
 * When dereferencing keyAgreement keys, only Ed25519 and X25519 curves are supported.
 * Other key types are omitted from the result and Ed25519 keys are converted to X25519
 *
 * @returns Promise<NormalizedVerificationMethod[]>
 */
export async function dereferenceDidKeys(
  didDocument: DIDDocument,
  section: DIDDocumentSection = 'keyAgreement',
  context: IAgentContext<IResolver>,
): Promise<_NormalizedVerificationMethod[]> {
  const convert = section === 'keyAgreement'
  if (section === 'service') {
    return []
  }
  return (
    await Promise.all(
      (didDocument[section] || []).map(async (key: string | VerificationMethod) => {
        if (typeof key === 'string') {
          try {
            return (await context.agent.getDIDComponentById({
              didDocument,
              didUrl: key,
              section,
            })) as _ExtendedVerificationMethod
          } catch (e) {
            return null
          }
        } else {
          return key as _ExtendedVerificationMethod
        }
      }),
    )
  )
    .filter(isDefined)
    .map((key) => {
      const hexKey = convertToPublicKeyHex(key, convert)
      const { publicKeyHex, publicKeyBase58, publicKeyBase64, publicKeyJwk, ...keyProps } = key
      const newKey = { ...keyProps, publicKeyHex: hexKey }
      if (convert && 'Ed25519VerificationKey2018' === newKey.type) {
        newKey.type = 'X25519KeyAgreementKey2019'
      }
      return newKey
    })
    .filter((key) => key.publicKeyHex.length > 0)
}

function convertToPublicKeyHex(pk: _ExtendedVerificationMethod, convert: boolean): string {
  let keyBytes: Uint8Array
  if (pk.publicKeyHex) {
    keyBytes = u8a.fromString(pk.publicKeyHex, 'base16')
  } else if (pk.publicKeyBase58) {
    keyBytes = u8a.fromString(pk.publicKeyBase58, 'base58btc')
  } else if (pk.publicKeyBase64) {
    keyBytes = u8a.fromString(pk.publicKeyBase64, 'base64pad')
  } else return ''
  if (convert) {
    if (['Ed25519', 'Ed25519VerificationKey2018'].includes(pk.type)) {
      keyBytes = convertPublicKeyToX25519(keyBytes)
    } else if (!['X25519', 'X25519KeyAgreementKey2019'].includes(pk.type)) {
      return ''
    }
  }
  return u8a.toString(keyBytes, 'base16')
}
