import {
  DIDDocument,
  DIDResolutionOptions,
  DIDResolutionResult,
  ServiceEndpoint,
  VerificationMethod,
} from 'did-resolver'
export { DIDDocument, DIDResolutionOptions, DIDResolutionResult } from 'did-resolver'
import { IPluginMethodMap } from './IAgent'

/**
 * Input arguments for {@link IResolver.resolveDid | resolveDid}
 * @public
 */
export interface ResolveDidArgs {
  /**
   * DID URL
   *
   * @example
   * `did:web:uport.me`
   */
  didUrl: string

  /**
   * DID resolution options that will be passed to the method specific resolver.
   * See: https://w3c.github.io/did-spec-registries/#did-resolution-input-metadata
   * See: https://www.w3.org/TR/did-core/#did-resolution-options
   */
  options?: DIDResolutionOptions
}

/**
 * DID Resolver interface
 * @public
 */
export interface IResolver extends IPluginMethodMap {
  /**
   * Resolves DID and returns DID Resolution Result
   *
   * @example
   * ```typescript
   * const doc = await agent.resolveDid({
   *   didUrl: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190'
   * })
   * expect(doc.didDocument).toEqual({
   *   '@context': [
   *     'https://www.w3.org/ns/did/v1',
   *     'https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld',
   *   ],
   *   id: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
   *   verificationMethod: [
   *     {
   *       id: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller',
   *       type: 'EcdsaSecp256k1RecoveryMethod2020',
   *       controller: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
   *       blockchainAccountId: '0xb09B66026bA5909A7CFE99b76875431D2b8D5190@eip155:4',
   *     },
   *   ],
   *   authentication: ['did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller'],
   *   assertionMethod: ['did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller'],
   * })
   * ```
   *
   * @param args - Input arguments for resolving a DID
   * @public
   */
  resolveDid(args: ResolveDidArgs): Promise<DIDResolutionResult>

  /**
   * Dereferences a DID URL fragment and returns the corresponding DID document entry.
   *
   * @example
   * ```typescript
   * const did = 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190'
   * const didFragment = `${did}#controller`
   * const fragment = await agent.getDIDComponentById({
   *   didDocument: (await agent.resolveDid({didUrl: did}))?.didDocument,
   *   didUrl: didFragment,
   *   section: 'authentication'
   * })
   * expect(fragment).toEqual({
   *       id: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller',
   *       type: 'EcdsaSecp256k1RecoveryMethod2020',
   *       controller: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
   *       blockchainAccountId: '0xb09B66026bA5909A7CFE99b76875431D2b8D5190@eip155:4',
   *     })
   * ```
   *
   * @param args.didDocument - the DID document from which to extract the fragment.
   *   This MUST be the document resolved by {@link resolveDid}
   * @param args.didUrl - the DID URI that needs to be dereferenced
   * @param args.section - Optional - the section of the DID Document to be used for dereferencing
   *
   * @returns a `Promise` containing the {@link did-resolver#VerificationMethod | VerificationMethod} or
   *   {@link did-resolver#ServiceEndpoint | ServiceEndpoint}
   *
   * @throws `not_found:...` in case the fragment is not displayed in the DID document
   *
   * @beta
   */
  getDIDComponentById(args: {
    /**
     * the DID document from which to extract the fragment. This MUST be the document resolved by {@link resolveDid}
     */
    didDocument: DIDDocument
    /**
     * The DID URI that refers to the subsection by #fragment. Example: did:example:identifier#controller
     */
    didUrl: string
    /**
     * The section of the DID document where to search for the fragment. Example 'keyAgreement'
     */
    section?: DIDDocumentSection
  }): Promise<VerificationMethod | ServiceEndpoint>
}

export type DIDDocumentSection =
  | 'verificationMethod'
  | 'publicKey' //used for backward compatibility
  | 'service'
  | 'authentication'
  | 'assertionMethod'
  | 'keyAgreement'
  | 'capabilityInvocation'
  | 'capabilityDelegation'
