import { IIdentifier, IKey, IService, IAgentContext, IKeyManager } from '@veramo/core'
import { AbstractIdentifierProvider } from '@veramo/did-manager'
import Debug from 'debug'
const debug = Debug('veramo:did-provider-ion')

import * as ION from '@decentralized-identity/ion-tools'
import { keyUtils as secp256k1_keyUtils } from '@transmute/did-key-secp256k1'
import { verificationMethodTypes } from 'ethr-did-resolver'


type IContext = IAgentContext<IKeyManager>

/**
 * {@link @veramo/did-manager#DIDManager} identifier provider for `did:ion` identifiers
 * @public
 */
export class IonDIDProvider extends AbstractIdentifierProvider {
  private defaultKms: string

  constructor(options: { defaultKms: string }) {
    super()
    this.defaultKms = options.defaultKms
  }

  async createIdentifier(
    { kms, options }: { kms?: string; options?: any },
    context: IContext,
  ): Promise<Omit<IIdentifier, 'provider'>> {
    const key = await context.agent.keyManagerCreate({ kms: kms || this.defaultKms, type: 'Secp256k1' })
    // convert to JWK (note, we should have a discussion about key dependencies here
    // TODO: @transmute/did-key-secp256k1 already comes in as an ION dependency and is based on JOSE
    const publicJwk = secp256k1_keyUtils.publicKeyJwkFromPublicKeyHex(key.publicKeyHex)

    console.log(`KeyID: ${key.kid}`)
    const did = new ION.DID({
      content: {
        // TODO: why is this called publicKeys?
        publicKeys: [
          {
            // TODO: ION restricts this to 50 chars atm
            id: key.kid.substr(0, 50), // "DID#key-1".
            // TODO: This is currently imported
            type: verificationMethodTypes.EcdsaSecp256k1VerificationKey2019,
            publicKeyJwk: publicJwk,
            purposes: [ 'authentication' ]
          }
        ],
      }
    });

    const requestBody = await did.generateRequest(0); // 0 = Create
    // console.log('requestBody: ' + JSON.stringify(requestBody))
    const request = new ION.AnchorRequest(requestBody);
    // console.log('request: ' + JSON.stringify(request))
    const response = await request.submit();
    // console.log('response: ' + JSON.stringify(response))



    const identifier: Omit<IIdentifier, 'provider'> = {
      did: await did.getURI(),
      controllerKeyId: key.kid,
      keys: [key],
      services: [],
    }

    // TODO: Long version DID is not conformant to "initial value" definition.
    console.log(`Created (short version): ${ await did.getURI('short') }`)
    debug('Created', identifier.did)
    return identifier
  }

  async deleteIdentifier(identifier: IIdentifier, context: IContext): Promise<boolean> {
    for (const { kid } of identifier.keys) {
      await context.agent.keyManagerDelete({ kid })
    }
    return true
  }

  async addKey(
    { identifier, key, options }: { identifier: IIdentifier; key: IKey; options?: any },
    context: IContext,
  ): Promise<any> {
    throw new Error('Not Implemented')
  }

  async addService(
    { identifier, service, options }: { identifier: IIdentifier; service: IService; options?: any },
    context: IContext,
  ): Promise<any> {
    throw new Error('Not Implemented')
  }

  async removeKey(
    args: { identifier: IIdentifier; kid: string; options?: any },
    context: IContext,
  ): Promise<any> {
    throw new Error('Not Implemented')
  }

  async removeService(
    args: { identifier: IIdentifier; id: string; options?: any },
    context: IContext,
  ): Promise<any> {
    throw new Error('Not Implemented')
  }
}
