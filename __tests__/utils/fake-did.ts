import { IAgentContext, IKeyManager, IIdentifier, IKey, IService, IDIDManager } from '@veramo/core'
import { AbstractIdentifierProvider } from '../../packages/did-manager/src/index'
import {
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDResolver,
  Resolvable,
  ParsedDID,
  VerificationMethod,
} from 'did-resolver'
import { TAgent } from '@veramo/core/src'
import { _NormalizedVerificationMethod } from '../../packages/did-comm/src'

/**
 * A DID method that uses the information stored by the DID manager to resolve
 */
export class FakeDidProvider extends AbstractIdentifierProvider {
  private defaultKms: string

  constructor({ defaultKms }: { defaultKms: string } = { defaultKms: 'local' }) {
    super()
    this.defaultKms = defaultKms
  }

  async createIdentifier(
    { kms, alias, options }: { kms?: string; alias?: string; options?: any },
    context: IAgentContext<IKeyManager>,
  ): Promise<Omit<IIdentifier, 'provider'>> {
    const key = await context.agent.keyManagerCreate({
      kms: kms || this.defaultKms,
      type: options?.type || 'Secp256k1',
    })

    const identifier: Omit<IIdentifier, 'provider'> = {
      did: 'did:fake:' + alias,
      controllerKeyId: key.kid,
      keys: [key],
      services: [],
    }
    return identifier
  }

  async deleteIdentifier(identifier: IIdentifier, context: IAgentContext<IKeyManager>): Promise<boolean> {
    for (const { kid } of identifier.keys) {
      await context.agent.keyManagerDelete({ kid })
    }
    return true
  }

  async addKey(
    { identifier, key, options }: { identifier: IIdentifier; key: IKey; options?: any },
    context: IAgentContext<IKeyManager>,
  ): Promise<any> {
    return { success: true }
  }

  async addService(
    { identifier, service, options }: { identifier: IIdentifier; service: IService; options?: any },
    context: IAgentContext<IKeyManager>,
  ): Promise<any> {
    return { success: true }
  }

  async removeKey(
    args: { identifier: IIdentifier; kid: string; options?: any },
    context: IAgentContext<IKeyManager>,
  ): Promise<any> {
    return { success: true }
  }

  async removeService(
    args: { identifier: IIdentifier; id: string; options?: any },
    context: IAgentContext<IKeyManager>,
  ): Promise<any> {
    return { success: true }
  }
}

export class FakeDidResolver {
  getAgent: () => TAgent<IDIDManager>

  constructor(getAgent: () => TAgent<IDIDManager>) {
    this.getAgent = getAgent
  }

  resolveFakeDid: DIDResolver = async (
    didUrl: string,
    _parsed: ParsedDID,
    _resolver: Resolvable,
    options: DIDResolutionOptions,
  ): Promise<DIDResolutionResult> => {
    try {
      const agent = this.getAgent()
      const identifier = await agent.didManagerGet({ did: _parsed.did })
      const did = _parsed.did
      const verificationMethod: VerificationMethod[] = identifier.keys.map((key) => {
        const vm: _NormalizedVerificationMethod = { ...key, controller: did, id: `${did}#${key.kid}` }
        switch (key.type) {
          case 'Secp256k1':
            vm.type = 'EcdsaSecp256k1VerificationKey2019'
            break
          case 'Ed25519':
            vm.type = 'Ed25519VerificationKey2018'
            break
          case 'X25519':
            vm.type = 'X25519KeyAgreementKey2019'
            break
          default:
            break
        }
        const { meta, description, kid, ...result } = vm as any
        return result
      })
      const vmIds = verificationMethod.map((vm) => vm.id)
      const service = identifier.services.map((service) => {
        service.id = `${did}#${service.id}`
        delete service.description
        return service
      })

      const didResolution: DIDResolutionResult = {
        didResolutionMetadata: {},
        didDocument: {
          id: did,
          service,
          verificationMethod,
          keyAgreement: vmIds,
          authentication: vmIds,
          assertionMethod: vmIds,
        },
        didDocumentMetadata: {},
      }
      return didResolution
    } catch (err) {
      return {
        didDocumentMetadata: {},
        didResolutionMetadata: { error: 'invalidDid', message: err.toString() },
        didDocument: null,
      }
    }
  }

  getDidFakeResolver() {
    return { fake: this.resolveFakeDid.bind(this) }
  }
}
