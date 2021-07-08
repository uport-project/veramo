import {
  IAgentContext,
  IDIDManager,
  IKeyManager,
  IPluginMethodMap,
  VerifiablePresentation,
} from '@veramo/core'
import { IDataStoreORM, UniqueVerifiableCredential } from '@veramo/data-store'
import { ICredentialIssuer } from '@veramo/credential-w3c'

/**
 * Used for requesting Credentials using Selective Disclosure.
 * Represents an accepted issuer of a credential.
 *
 * @beta
 */
export interface Issuer {
  /**
   * The DID of the issuer of a requested credential.
   */
  did: string

  /**
   * A URL where a credential of that type can be obtained.
   */
  url: string
}

/**
 * Represents the Selective Disclosure request parameters.
 *
 * @remarks See {@link https://github.com/uport-project/specs/blob/develop/messages/sharereq.md | Selective Disclosure Request}
 *
 * @beta
 */
export interface ISelectiveDisclosureRequest {
  /**
   * The issuer of the request
   */
  issuer: string
  /**
   * The target of the request
   */
  subject?: string
  /**
   * The URL where the response should be sent back
   */
  replyUrl?: string

  tag?: string

  /**
   * A list of claims that are being requested
   */
  claims: ICredentialRequestInput[]

  /**
   * A list of issuer credentials that the target will use to establish trust
   */
  credentials?: string[]
}

/**
 * Describes a particular credential that is being requested
 *
 * @remarks See {@link https://github.com/uport-project/specs/blob/develop/messages/sharereq.md | Selective Disclosure Request}
 *
 * @beta
 */
export interface ICredentialRequestInput {
  /**
   * Motive for requiring this credential.
   */
  reason?: string

  /**
   * If it is essential. A response that does not include this credential is not sufficient.
   */
  essential?: boolean

  /**
   * The credential type. See {@link https://www.w3.org/TR/vc-data-model/#types | W3C Credential Types}
   */
  credentialType?: string

  /**
   * The credential context. See {@link https://www.w3.org/TR/vc-data-model/#contexts | W3C Credential Context}
   */
  credentialContext?: string

  /**
   * The name of the claim property that the credential should express.
   */
  claimType: string

  /**
   * The value of the claim that the credential should express.
   */
  claimValue?: string

  /**
   * A list of accepted Issuers for this credential.
   */
  issuers?: Issuer[]
}

/**
 * The credentials that make up a response of a Selective Disclosure
 *
 * @remarks See {@link https://github.com/uport-project/specs/blob/develop/messages/sharereq.md | Selective Disclosure Request}
 *
 * @beta
 */
export interface ICredentialsForSdr extends ICredentialRequestInput {
  credentials: UniqueVerifiableCredential[]
}

/**
 * The result of a selective disclosure response validation.
 *
 * @beta
 */
export interface IPresentationValidationResult {
  valid: boolean
  claims: ICredentialsForSdr[]
}

/**
 * Contains the parameters of a Selective Disclosure Request.
 *
 * @remarks See {@link https://github.com/uport-project/specs/blob/develop/messages/sharereq.md | Selective Disclosure Request}
 * specs
 *
 * @beta
 */
export interface ICreateSelectiveDisclosureRequestArgs {
  data: ISelectiveDisclosureRequest
}

/**
 * Encapsulates the params needed to gather credentials to fulfill a Selective disclosure request.
 *
 * @remarks See {@link https://github.com/uport-project/specs/blob/develop/messages/sharereq.md | Selective Disclosure Request}
 * specs
 *
 * @beta
 */
export interface IGetVerifiableCredentialsForSdrArgs {
  /**
   * The Selective Disclosure Request (issuer is omitted)
   */
  sdr: Omit<ISelectiveDisclosureRequest, 'issuer'>

  /**
   * The DID of the subject
   */
  did?: string
}

/**
 * A tuple used to verify a Selective Disclosure Response.
 * Encapsulates the response(`presentation`) and the corresponding request (`sdr`) that made it.
 *
 * @beta
 */
export interface IValidatePresentationAgainstSdrArgs {
  presentation: VerifiablePresentation
  sdr: ISelectiveDisclosureRequest
}

/**
 * Profile data
 *
 * @beta
 */
export interface ICreateProfileCredentialsArgs {
  /**
   * Holder DID
   */
  holder: string
  /**
   * Optional. Verifier DID
   */
  verifier?: string
  /**
   * Optional. Name
   */
  name?: string
  /**
   * Optional. Picture URL
   */
  picture?: string
  /**
   * Optional. URL
   */
  url?: string
  /**
   * Save presentation
   */
  save: boolean
  /**
   * Send presentation
   */
  send: boolean
}

/**
 * Describes the interface of a Selective Disclosure plugin.
 *
 * @remarks See {@link https://github.com/uport-project/specs/blob/develop/messages/sharereq.md | Selective Disclosure Request}
 *
 * @beta
 */
export interface ISelectiveDisclosure extends IPluginMethodMap {
  createSelectiveDisclosureRequest(
    args: ICreateSelectiveDisclosureRequestArgs,
    context: IAgentContext<IDIDManager & IKeyManager>,
  ): Promise<string>
  getVerifiableCredentialsForSdr(
    args: IGetVerifiableCredentialsForSdrArgs,
    context: IAgentContext<IDataStoreORM>,
  ): Promise<Array<ICredentialsForSdr>>
  validatePresentationAgainstSdr(
    args: IValidatePresentationAgainstSdrArgs,
    context: IAgentContext<{}>,
  ): Promise<IPresentationValidationResult>
  createProfilePresentation(
    args: ICreateProfileCredentialsArgs,
    context: IAgentContext<ICredentialIssuer & IDIDManager>,
  ): Promise<VerifiablePresentation>
}
