import { IDIDManager } from '@veramo/core'
import { TAgent, IResolver, IAgentOptions } from '../../packages/core/src'

type ConfiguredAgent = TAgent<IResolver & IDIDManager>

export default (testContext: {
  getAgent: (options?: IAgentOptions) => ConfiguredAgent
  setup: (options?: IAgentOptions) => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('resolving didUrl', () => {
    let agent: ConfiguredAgent

    beforeAll(async () => {
      await testContext.setup()
      agent = testContext.getAgent()
      return true
    })
    afterAll(testContext.tearDown)

    it('should resolve didUrl', async () => {
      const didUrl = 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190'
      const didDoc = (await agent.resolveDid({ didUrl })).didDocument
      expect(didDoc?.id).toEqual(didUrl)
    })

    it('should resolve did:key', async () => {
      const didUrl = 'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL'
      const result = await agent.resolveDid({ didUrl })
      const didDoc = result.didDocument
      expect(didDoc?.id).toEqual(didUrl)
    })

    it('should resolve imported fake did', async () => {
      const did = 'did:fake:myfakedid'
      const importedFakeDID = await agent.didManagerImport({
        did,
        keys: [
          {
            type: 'Ed25519',
            kid: 'fake-key-1',
            publicKeyHex: '1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
            privateKeyHex:
              'b57103882f7c66512dc96777cbafbeb2d48eca1e7a867f5a17a84e9a6740f7dc1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
            kms: 'local',
          },
        ],
        services: [
          {
            id: 'fake-service-1',
            type: 'fakeService',
            serviceEndpoint: 'http://it.is.fake.all.the.way.down',
          },
        ],
        provider: 'did:fake',
        alias: 'faker',
      })
      const resolved = await agent.resolveDid({ didUrl: did })
      expect(resolved.didDocument).toEqual({
        id: 'did:fake:myfakedid',
        service: [
          {
            id: 'did:fake:myfakedid#fake-service-1',
            type: 'fakeService',
            serviceEndpoint: 'http://it.is.fake.all.the.way.down',
          },
        ],
        verificationMethod: [
          {
            type: 'Ed25519VerificationKey2018',
            publicKeyHex: '1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
            kms: 'local',
            controller: 'did:fake:myfakedid',
            id: 'did:fake:myfakedid#fake-key-1',
          },
        ],
        keyAgreement: ['did:fake:myfakedid#fake-key-1'],
        authentication: ['did:fake:myfakedid#fake-key-1'],
        assertionMethod: ['did:fake:myfakedid#fake-key-1'],
      })
    })

    it('should resolve created fake did', async () => {
      const alias = 'allfake'
      const did = `did:fake:${alias}`
      const createdDID = await agent.didManagerCreate({ alias, provider: 'did:fake' })
      const modified = await agent.didManagerAddService({
        did,
        service: { id: 'fake-service-x', type: 'FakeService', serviceEndpoint: 'none' },
      })
      const resolved = await agent.resolveDid({ didUrl: did })
      expect(resolved?.didDocument?.service).toEqual([
        { id: `${did}#fake-service-x`, type: 'FakeService', serviceEndpoint: 'none' },
      ])
    })

    it('should return an error for unsupported did methods', async () => {
      expect.assertions(1)
      await expect(agent.resolveDid({ didUrl: 'did:foo:bar' })).resolves.toEqual({
        didDocument: null,
        didResolutionMetadata: { error: 'unsupportedDidMethod' },
        didDocumentMetadata: {},
      })
    })

    it('should throw error when resolving garbage', async () => {
      //@ts-ignore
      await expect(agent.resolveDid()).resolves.toEqual({
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: { error: 'invalidDid' },
      })
      //@ts-ignore
      await expect(agent.resolveDid({})).resolves.toEqual({
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: { error: 'invalidDid' },
      })
      //@ts-ignore
      await expect(agent.resolveDid({ didUrl: 'garbage' })).resolves.toEqual({
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: { error: 'invalidDid' },
      })
    })
  })

  describe('resolving didUrl with validation', () => {
    let agent: ConfiguredAgent

    beforeAll(async () => {
      await testContext.setup({ schemaValidation: true })
      agent = testContext.getAgent({ schemaValidation: true })
      return true
    })
    afterAll(testContext.tearDown)

    it('should throw validation error', async () => {
      //@ts-ignore
      await expect(agent.resolveDid()).rejects.toHaveProperty('name', 'ValidationError')
      //@ts-ignore
      await expect(agent.resolveDid({})).rejects.toHaveProperty('name', 'ValidationError')
      //@ts-ignore
      await expect(agent.resolveDid({ didUrl: 1 })).rejects.toHaveProperty('name', 'ValidationError')
    })
  })
}
