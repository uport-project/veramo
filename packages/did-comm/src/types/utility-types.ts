import { IKey, KeyMetadata } from '@veramo/core'
import { JWE } from 'did-jwt'
import { VerificationMethod } from 'did-resolver'
import { DIDCommMessageMediaType, IDIDCommMessage } from './message-types'

/**
 * Represents a plaintext DIDComm v2 message object.
 * @internal
 */
export type _DIDCommPlainMessage = IDIDCommMessage & { typ: DIDCommMessageMediaType.PLAIN }

/**
 * Represents an encrypted DIDComm v2 message object
 * @internal
 */
export type _DIDCommEncryptedMessage = JWE

/**
 * Type definition of a JSON serialized JWS in flattened form (only one signer)
 * @internal
 */
export type _FlattenedJWS = {
  payload: string
  protected?: string
  header?: Record<string, any>
  signature: string
}

/**
 * Type definition of a JSON serialized JWS in generic form
 * @internal
 */
export type _GenericJWS = {
  payload: string
  signatures: [{ protected?: string; header?: Record<string, any>; signature: string }]
}

/**
 * Composite type representing the 2 accepted forms of JWS DIDComm v2 message
 * @internal
 */
export type _DIDCommSignedMessage = _FlattenedJWS | _GenericJWS

/**
 * Broader definition of Verification method that includes the legacy publicKeyBase64
 * @internal
 */
export type _ExtendedVerificationMethod = VerificationMethod & { publicKeyBase64?: string }

/**
 * Represents an {@link @veramo/core#IKey} that has been augmented with its corresponding
 * entry from a DID document.
 * `key.meta.verificationMethod` will contain the {@link did-resolver#VerificationMethod}
 * object from the {@link did-resolver#DIDDocument}
 * @internal
 */
export interface _ExtendedIKey extends IKey {
  meta: KeyMetadata & {
    verificationMethod: _NormalizedVerificationMethod
  }
}

/**
 * Represents a {@link did-resolver#VerificationMethod} whose public key material
 * has been converted to `publicKeyHex`
 *
 * @internal
 */
export type _NormalizedVerificationMethod = Omit<
  VerificationMethod,
  'publicKeyBase58' | 'publicKeyBase64' | 'publicKeyJwk'
>
