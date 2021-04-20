import {
  IAgentContext,
  IAgentPlugin,
  IResolver,
  IDIDManager,
  IKeyManager,
  IPluginMethodMap,
  W3CCredential,
  W3CPresentation,
  VerifiableCredential,
  VerifiablePresentation,
  IDataStore, IKey, IIdentifier,
} from '@veramo/core'

import {
  createVerifiableCredentialJwt,
  createVerifiablePresentationJwt,
  normalizeCredential,
  normalizePresentation,
} from 'did-jwt-vc'

// Start LOAD LD Libraries
const { purposes: { AssertionProofPurpose }} = require("jsonld-signatures");
const vc = require('vc-js');
const { defaultDocumentLoader } = vc;
const {extendContextLoader} = require('jsonld-signatures');
const {EcdsaSecp256k1RecoveryMethod2020, EcdsaSecp256k1RecoverySignature2020} = require('EcdsaSecp256k1RecoverySignature2020')
import {Ed25519Signature2020, Ed25519KeyPair2020} from '@transmute/ed25519-signature-2020'
const Base58 = require('base-58');
// Start END LD Libraries

import { schema } from './'
import localContexts from './contexts'
import Debug from 'debug'
const debug = Debug('veramo:w3c:action-handler')

/**
 * The type of encoding to be used for the Verifiable Credential or Presentation to be generated.
 *
 * Only `jwt` and `lds` is supported at the moment.
 *
 * @public
 */
export type ProofFormat = 'jwt' | 'lds'

/**
 * Encapsulates the parameters required to create a
 * {@link https://www.w3.org/TR/vc-data-model/#presentations | W3C Verifiable Presentation}
 *
 * @public
 */
export interface ICreateVerifiablePresentationArgs {
  /**
   * The json payload of the Presentation according to the
   * {@link https://www.w3.org/TR/vc-data-model/#presentations | canonical model}.
   *
   * The signer of the Presentation is chosen based on the `holder` property
   * of the `presentation`
   *
   * '@context', 'type' and 'issuanceDate' will be added automatically if omitted
   */
  presentation: {
    id?: string
    holder: string
    issuanceDate?: string
    expirationDate?: string
    '@context'?: string[]
    type?: string[]
    verifier: string[]
    verifiableCredential: VerifiableCredential[]
    [x: string]: any
  }

  /**
   * If this parameter is true, the resulting VerifiablePresentation is sent to the
   * {@link @veramo/core#IDataStore | storage plugin} to be saved
   */
  save?: boolean

  /**
   * Optional (only JWT) string challenge parameter to add to the verifiable presentation.
   */
  challenge?: string

  /**
   * Optional string domain parameter to add to the verifiable presentation.
   */
  domain?: string

  /**
   * The desired format for the VerifiablePresentation to be created.
   * Currently, only JWT is supported
   */
  proofFormat: ProofFormat

  /**
   * Remove payload members during JWT-JSON transformation. Defaults to `true`.
   * See https://www.w3.org/TR/vc-data-model/#jwt-encoding
   */
  removeOriginalFields?: boolean
}

/**
 * Encapsulates the parameters required to create a
 * {@link https://www.w3.org/TR/vc-data-model/#credentials | W3C Verifiable Credential}
 *
 * @public
 */
export interface ICreateVerifiableCredentialArgs {
  /**
   * The json payload of the Credential according to the
   * {@link https://www.w3.org/TR/vc-data-model/#credentials | canonical model}
   *
   * The signer of the Credential is chosen based on the `issuer.id` property
   * of the `credential`
   *
   * '@context', 'type' and 'issuanceDate' will be added automatically if omitted
   */
  credential: {
    '@context'?: string[]
    id?: string
    type?: string[]
    issuer: { id: string; [x: string]: any }
    issuanceDate?: string
    expirationDate?: string
    credentialSubject: {
      id?: string
      [x: string]: any
    }
    credentialStatus?: {
      id: string
      type: string
    }
    [x: string]: any
  }

  /**
   * If this parameter is true, the resulting VerifiablePresentation is sent to the
   * {@link @veramo/core#IDataStore | storage plugin} to be saved
   */
  save?: boolean

  /**
   * The desired format for the VerifiablePresentation to be created.
   * Currently, only JWT is supported
   */
  proofFormat: ProofFormat

  /**
   * Remove payload members during JWT-JSON transformation. Defaults to `true`.
   * See https://www.w3.org/TR/vc-data-model/#jwt-encoding
   */
  removeOriginalFields?: boolean
}

/**
 * Encapsulates the parameters required to verify a
 * {@link https://www.w3.org/TR/vc-data-model/#credentials | W3C Verifiable Credential}
 *
 * @public
 */
export interface IVerifyVerifiableCredentialArgs {
  /**
   * The json payload of the Credential according to the
   * {@link https://www.w3.org/TR/vc-data-model/#credentials | canonical model}
   *
   * The signer of the Credential is chosen based on the `issuer.id` property
   * of the `credential`
   *
   */
  credential: VerifiableCredential
}

/**
 * Encapsulates the parameters required to verify a
 * {@link https://www.w3.org/TR/vc-data-model/#presentations | W3C Verifiable Presentation}
 *
 * @public
 */
export interface IVerifyVerifiablePresentationArgs {
  /**
   * The json payload of the Credential according to the
   * {@link https://www.w3.org/TR/vc-data-model/#credentials | canonical model}
   *
   * The signer of the Credential is chosen based on the `issuer.id` property
   * of the `credential`
   *
   */
  presentation: {
    id?: string
    holder: string
    // issuanceDate?: string
    // expirationDate?: string
    '@context': string[]
    type: string[]
    // verifier: string[]
    verifiableCredential: VerifiableCredential[]
    proof: {
      type?: string
      [x: string]: any
    }
    [x: string]: any
  }

  /**
   * Optional (only for JWT) string challenge parameter to verify the verifiable presentation against
   */
  challenge?: string

  /**
   * Optional (only for JWT) string domain parameter to verify the verifiable presentation against
   */
  domain?: string
}

/**
 * The interface definition for a plugin that can generate Verifiable Credentials and Presentations
 *
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
export interface ICredentialIssuer extends IPluginMethodMap {
  /**
   * Creates a Verifiable Presentation.
   * The payload, signer and format are chosen based on the `args` parameter.
   *
   * @param args - Arguments necessary to create the Presentation.
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the {@link @veramo/core#VerifiablePresentation} that was requested or rejects with an error
   * if there was a problem with the input or while getting the key to sign
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#presentations | Verifiable Presentation data model }
   */
  createVerifiablePresentation(
    args: ICreateVerifiablePresentationArgs,
    context: IContext,
  ): Promise<VerifiablePresentation>

  /**
   * Creates a Verifiable Credential.
   * The payload, signer and format are chosen based on the `args` parameter.
   *
   * @param args - Arguments necessary to create the Presentation.
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the {@link @veramo/core#VerifiableCredential} that was requested or rejects with an error
   * if there was a problem with the input or while getting the key to sign
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   */
  createVerifiableCredential(
    args: ICreateVerifiableCredentialArgs,
    context: IContext,
  ): Promise<VerifiableCredential>


  /**
   * Verifies a Verifiable Credential JWT or LDS Format.
   *
   * @param args - Arguments necessary to verify a VerifiableCredential
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the boolean true on successful verification or rejects on error
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   */
  verifyVerifiableCredential(
    args: IVerifyVerifiableCredentialArgs,
    context: IContext,
  ): Promise<boolean>


  /**
   * Verifies a Verifiable Presentation JWT or LDS Format.
   *
   * @param args - Arguments necessary to verify a VerifiableCredential
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the boolean true on successful verification or rejects on error
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#presentations | Verifiable Credential data model}
   */
  verifyVerifiablePresentation(
    args: IVerifyVerifiablePresentationArgs,
    context: IContext,
  ): Promise<boolean>
}

/**
 * Represents the requirements that this plugin has.
 * The agent that is using this plugin is expected to provide these methods.
 *
 * This interface can be used for static type checks, to make sure your application is properly initialized.
 */
export type IContext = IAgentContext<
  IResolver &
    Pick<IDIDManager, 'didManagerGet'> &
    Pick<IDataStore, 'dataStoreSaveVerifiablePresentation' | 'dataStoreSaveVerifiableCredential'> &
    Pick<IKeyManager, 'keyManagerSignJWT' | 'keyManagerGet'>
>


//------------------------- BEGIN JSON_LD HELPER / DELEGATING STUFF
/**
 * TODO: General Implementation Notes
 * - (SOLVED) EcdsaSecp256k1Signature2019 (Signature) and EcdsaSecp256k1VerificationKey2019 (Key)
 * are not useable right now, since they are not able to work with blockChainId and ECRecover.
 * - DID Fragement Resolution.
 * - Key Manager and Verification Methods: Veramo currently implements no link between those.
 */

const getDocumentLoader = (context: IContext) => extendContextLoader(async (url: string) => {
  console.log(`resolving context for: ${url}`)

  // did resolution
  if (url.toLowerCase().startsWith('did:')) {
    const didDoc = await context.agent.resolveDid({ didUrl: url })
    let returnDocument = didDoc.didDocument

    if (!returnDocument) return

    // specific resolution modifications
    // did:ethr
    if (url.toLowerCase().startsWith('did:ethr')) {
      returnDocument.assertionMethod = []
      // TODO: EcdsaSecp256k1RecoveryMethod2020 does not support blockchainAccountId
      // blockchainAccountId to ethereumAddress
      returnDocument.verificationMethod?.forEach(x => {
        if (x.blockchainAccountId) {
          x.ethereumAddress = x.blockchainAccountId.substring(0, x.blockchainAccountId.lastIndexOf("@"))
        }

        // TODO: Verification method \"did:ethr:rinkeby:0x99b5bcc24ac2701d763aac0a8466ac51a189501b#controller\" not authorized by controller for proof purpose \"assertionMethod\"."
        // @ts-ignore
        returnDocument.assertionMethod.push(x.id)
      })
    }


    console.log(`Returning from Documentloader: ${JSON.stringify(returnDocument)}`)
    return {
      contextUrl: null,
      documentUrl: url,
      document: returnDocument
    };
  }

  if (localContexts.has(url)) {
    console.log(`Returning local context for: ${url}`)
    return {
      contextUrl: null,
      documentUrl: url,
      document: localContexts.get(url)
    };
  }

  return defaultDocumentLoader(url);
});

const getLDSigningSuite = (key: IKey, identifier: IIdentifier) => {
  let suite
  const controller = identifier.did

  if (!key.privateKeyHex) {
    throw Error('No private Key for LD Signing available.')
  }

  switch(key.type) {
    case 'Secp256k1':
      suite = new EcdsaSecp256k1RecoverySignature2020({
        key: new EcdsaSecp256k1RecoveryMethod2020({
          publicKeyHex: key.publicKeyHex,
          privateKeyHex: key.privateKeyHex,
          type: 'EcdsaSecp256k1RecoveryMethod2020', // A little verbose?
          controller,
          id: `${controller}#controller` // TODO: Only default controller verificationMethod supported
        }),
      });
      break;
    case 'Ed25519':
      suite = new Ed25519Signature2020({
        key: new Ed25519KeyPair2020({
          id: `${controller}#controller`,
          controller,
          publicKeyBase58: Base58.encode(Buffer.from(key.publicKeyHex, 'hex')),
          privateKeyBase58: Base58.encode(Buffer.from(key.privateKeyHex, 'hex')),
        })
      });
      break;
    default:
      throw new Error(`Unknown key type ${key.type}.`);
  }

  return suite
}

const issueLDVerifiableCredential = async (
  credential: W3CCredential,
  key: IKey,
  identifier: IIdentifier,
  context: IContext): Promise<VerifiableCredential> => {

  const suite = getLDSigningSuite(key, identifier)
  const documentLoader = getDocumentLoader(context)

  // some suites are misssisng the right contexts
  switch (suite.type) {
    case "EcdsaSecp256k1RecoverySignature2020":
      console.log(`Adding context to credential ${suite.type}`)
      credential['@context'].push('https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld')
      break
    default:
  }

  return await vc.issue({
    credential,
    suite,
    documentLoader,
    compactProof: false
  });
}

const signLDVerifiablePresentation = async (
  presentation: W3CPresentation,
  key: IKey,
  challenge: string | undefined,
  domain: string | undefined,
  identifier: IIdentifier,
  context: IContext
): Promise<VerifiablePresentation> => {

  const suite = getLDSigningSuite(key, identifier)
  const documentLoader = getDocumentLoader(context)

  // TODO: Remove invalid field 'verifiers' from Presentation. Needs to be adapted for LD credentials
  // Only remove empty array (vc.signPresentation will throw then)
  const sanitizedPresentation = presentation as any
  if (sanitizedPresentation.verifier.length == 0) {
    delete sanitizedPresentation.verifier
  }


  return await vc.signPresentation({
    presentation: sanitizedPresentation,
    suite,
    challenge,
    domain,
    documentLoader,
    purpose: new AssertionProofPurpose(),
    compactProof: false
  })
}

//------------------------- END JSON_LD HELPER / DELEGATING STUFF


/**
 * A Veramo plugin that implements the {@link ICredentialIssuer} methods.
 *
 * @public
 */
export class CredentialIssuer implements IAgentPlugin {
  readonly methods: ICredentialIssuer
  readonly schema = schema.ICredentialIssuer

  constructor() {
    this.methods = {
      createVerifiablePresentation: this.createVerifiablePresentation,
      createVerifiableCredential: this.createVerifiableCredential,
      verifyVerifiableCredential: this.verifyVerifiableCredential,
      verifyVerifiablePresentation: this.verifyVerifiablePresentation,
    }
  }

  /** {@inheritdoc ICredentialIssuer.createVerifiablePresentation} */
  async createVerifiablePresentation(
    args: ICreateVerifiablePresentationArgs,
    context: IContext,
  ): Promise<VerifiablePresentation> {
    try {
      const presentation: W3CPresentation = {
        ...args.presentation,
        '@context': args.presentation['@context'] || ['https://www.w3.org/2018/credentials/v1'],
        //FIXME: make sure 'VerifiablePresentation' is the first element in this array:
        type: args.presentation.type || ['VerifiablePresentation'],
      }

      //FIXME: if the identifier is not found, the error message should reflect that.
      const identifier = await context.agent.didManagerGet({ did: presentation.holder })
      //FIXME: `args` should allow picking a key or key type
      const key = identifier.keys.find((k) => k.type === 'Secp256k1' || k.type === 'Ed25519')
      if (!key) throw Error('No signing key for ' + identifier.did)

      //------------------------- BEGIN JSON_LD INSERT
      if (args.proofFormat === 'lds') {
        // LDS ONLY works on `controllerKeyId` because it's uniquely resolvable as a verificationMethod
        if (key.kid != identifier.controllerKeyId) {
          throw new Error('Trying to use a non-controller key for an LD-Proof is not supported')
        }

        const keyPayload = await context.agent.keyManagerGet({ kid: key.kid })
        return signLDVerifiablePresentation(presentation,
          keyPayload, args.challenge, args.domain, identifier, context)
      }
      //------------------------- END JSON_LD INSERT
      else {
        // only add issuanceDate for JWT
        presentation.issuanceDate = args.presentation.issuanceDate || new Date().toISOString()
      }

      //FIXME: Throw an `unsupported_format` error if the `args.proofFormat` is not `jwt`
      const signer = (data: string | Uint8Array) => context.agent.keyManagerSignJWT({ kid: key.kid, data })
      debug('Signing VP with', identifier.did)
      const jwt = await createVerifiablePresentationJwt(
        presentation,
        { did: identifier.did, signer },
        { removeOriginalFields: args.removeOriginalFields },
      )
      //FIXME: flagging this as a potential privacy leak.
      debug(jwt)
      const verifiablePresentation = normalizePresentation(jwt)
      if (args.save) {
        await context.agent.dataStoreSaveVerifiablePresentation({ verifiablePresentation })
      }
      return verifiablePresentation
    } catch (error) {
      debug(error)
      return Promise.reject(error)
    }
  }

  /** {@inheritdoc ICredentialIssuer.createVerifiableCredential} */
  async createVerifiableCredential(
    args: ICreateVerifiableCredentialArgs,
    context: IContext,
  ): Promise<VerifiableCredential> {
    try {
      const credential: W3CCredential = {
        ...args.credential,
        '@context': args.credential['@context'] || ['https://www.w3.org/2018/credentials/v1'],
        //FIXME: make sure 'VerifiableCredential' is the first element in this array:
        type: args.credential.type || ['VerifiableCredential'],
        issuanceDate: args.credential.issuanceDate || new Date().toISOString(),
      }

      //FIXME: if the identifier is not found, the error message should reflect that.
      const identifier = await context.agent.didManagerGet({ did: credential.issuer.id })
      //FIXME: `args` should allow picking a key or key type
      const key = identifier.keys.find((k) => k.type === 'Secp256k1' || k.type === 'Ed25519')
      if (!key) throw Error('No signing key for ' + identifier.did)

      //------------------------- BEGIN JSON_LD INSERT
      if (args.proofFormat === 'lds') {
        // LDS ONLY works on `controllerKeyId` because it's uniquely resolvable as a verificationMethod
        if (key.kid != identifier.controllerKeyId) {
          throw new Error('Trying to use a non-controller key for an LD-Proof is not supported')
        }

        const keyPayload = await context.agent.keyManagerGet({ kid: key.kid })
        return issueLDVerifiableCredential(credential, keyPayload, identifier, context)
      }
      //------------------------- END JSON_LD INSERT

      //FIXME: Throw an `unsupported_format` error if the `args.proofFormat` is not `jwt`
      const signer = (data: string | Uint8Array) => context.agent.keyManagerSignJWT({ kid: key.kid, data })

      debug('Signing VC with', identifier.did)
      let alg = 'ES256K'
      if (key.type === 'Ed25519') {
        alg = 'EdDSA'
      }
      const jwt = await createVerifiableCredentialJwt(
        credential,
        { did: identifier.did, signer, alg },
        { removeOriginalFields: args.removeOriginalFields },
      )
      //FIXME: flagging this as a potential privacy leak.
      debug(jwt)
      const verifiableCredential = normalizeCredential(jwt)
      if (args.save) {
        await context.agent.dataStoreSaveVerifiableCredential({ verifiableCredential })
      }

      return verifiableCredential
    } catch (error) {
      debug(error)
      return Promise.reject(error)
    }
  }

  /** {@inheritdoc ICredentialIssuer.verifyVerifiableCredential} */
  async verifyVerifiableCredential(
    args: IVerifyVerifiableCredentialArgs,
    context: IContext,
  ): Promise<boolean> {
    const credential = args.credential
    // JWT
    if (credential.proof.jwt) {
      // Not implemented yet.
      throw Error('verifyVerifiableCredential currently does not the verification of VC-JWT credentials.')
    }

    const result = await vc.verifyCredential({
      credential,
      suite: [new EcdsaSecp256k1RecoverySignature2020(), new Ed25519Signature2020()],
      documentLoader: getDocumentLoader(context),
      purpose: new AssertionProofPurpose(),
      compactProof: false
    });

    if (result.verified)
      return true

    // NOT verified.

    // result can include raw Error
    console.log(`Error verifying LD Verifiable Credential`)
    console.log(JSON.stringify(result, null, 2));
    throw Error('Error verifying LD Verifiable Credential')
  }

  /** {@inheritdoc ICredentialIssuer.verifyVerifiablePresentation} */
  async verifyVerifiablePresentation(
    args: IVerifyVerifiablePresentationArgs,
    context: IContext,
  ): Promise<boolean> {
    const presentation = args.presentation
    // JWT
    if (presentation.proof.jwt) {
      // Not implemented yet.
      throw Error('verifyVerifiablePresentation currently does not the verification of VC-JWT credentials.')
    }

    const result = await vc.verify({
      presentation,
      suite: [new EcdsaSecp256k1RecoverySignature2020(), new Ed25519Signature2020()],
      documentLoader: getDocumentLoader(context),
      challenge: args.challenge,
      domain: args.domain,
      purpose: new AssertionProofPurpose(),
      compactProof: false
    });

    if (result.verified)
      return true

    // NOT verified.

    // result can include raw Error
    console.log(`Error verifying LD Verifiable Presentation`)
    console.log(JSON.stringify(result, null, 2));
    throw Error('Error verifying LD Verifiable Presentation')
  }
}
