import { TAgent, IDIDManager, IDataStore, IMessageHandler } from '../../packages/core/src'
import { ICredentialIssuer } from '../../packages/credential-w3c/src'
import { ISelectiveDisclosure } from '../../packages/selective-disclosure/src'
import { IDataStoreORM } from '../../packages/data-store/src'

type ConfiguredAgent = TAgent<
  IDIDManager & ICredentialIssuer & IDataStoreORM & IDataStore & IMessageHandler & ISelectiveDisclosure
>

export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('Documentation examples', () => {
    let agent: ConfiguredAgent

    beforeAll(() => {
      testContext.setup()
      agent = testContext.getAgent()
    })
    afterAll(testContext.tearDown)

    //DO NOT EDIT MANUALLY START

    it('core-IResolver-getDIDComponentById example', async () => {
      const did = 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190'
      const didFragment = `${did}#controller`
      const fragment = await agent.getDIDComponentById({
        didDocument: (await agent.resolveDid({ didUrl: did }))?.didDocument,
        didUrl: didFragment,
        section: 'authentication',
      })
      expect(fragment).toEqual({
        id: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller',
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
        blockchainAccountId: '0xb09B66026bA5909A7CFE99b76875431D2b8D5190@eip155:4',
      })
    })

    it('core-IResolver-resolveDid example', async () => {
      const doc = await agent.resolveDid({
        didUrl: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
      })
      expect(doc.didDocument).toEqual({
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld',
        ],
        id: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
        verificationMethod: [
          {
            id: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller',
            type: 'EcdsaSecp256k1RecoveryMethod2020',
            controller: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
            blockchainAccountId: '0xb09B66026bA5909A7CFE99b76875431D2b8D5190@eip155:4',
          },
        ],
        authentication: ['did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller'],
        assertionMethod: ['did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190#controller'],
      })
    })

    it('core-IDIDManager-didManagerCreate example', async () => {
      const identifier = await agent.didManagerCreate({
        alias: 'alice',
        provider: 'did:ethr:rinkeby',
        kms: 'local',
      })
    })

    it('core-IDIDManager-didManagerFind example', async () => {
      const aliceIdentifiers = await agent.didManagerFind({
        alias: 'alice',
      })

      const rinkebyIdentifiers = await agent.didManagerFind({
        provider: 'did:ethr:rinkeby',
      })
    })

    it('core-IDIDManager-didManagerGetByAlias example', async () => {
      const identifier = await agent.didManagerGetByAlias({
        alias: 'alice',
        provider: 'did:ethr:rinkeby',
      })
    })

    it('core-IDIDManager-didManagerSetAlias example', async () => {
      const identifier = await agent.didManagerCreate()
      const result = await agent.didManagerSetAlias({
        did: identifier.did,
        alias: 'carol',
      })
    })

    //DO NOT EDIT MANUALLY END
  })
}
