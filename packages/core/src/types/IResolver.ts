import { DIDResolutionOptions, DIDResolutionResult } from 'did-resolver'
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
   * Resolves DID and returns DID Document
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
}
