import { TAgent, IKeyManager, IDIDManager } from '../../packages/core/src'
import { VeramoDidProvider } from '../../packages/ceramic/src'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { randomBytes } from '@stablelib/random'
import { DID } from 'dids'
import KeyDidResolver from 'key-did-resolver'
import CeramicClient from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'

const API_URL = "https://ceramic-clay.3boxlabs.com"

type ConfiguredAgent = TAgent<IKeyManager & IDIDManager>

export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('ceramic', () => {
    let agent: ConfiguredAgent
    const seed = randomBytes(32)

    beforeAll(async () => {
      await testContext.setup()
      agent = testContext.getAgent()
      return true
    })
    afterAll(testContext.tearDown)

    it('reference (native) implementation', async () => {
      const resolver = { ...KeyDidResolver.getResolver() }
      const provider = new Ed25519Provider(seed)
      const did = new DID({ resolver, provider })
      await did.authenticate()
      const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })

      expect(jws).toHaveProperty('payload')
      expect(jws).toHaveProperty('signatures')
      expect(linkedBlock).toBeInstanceOf(Uint8Array)

    })

    it('authenticate and createDagJWS', async () => {
      const alice = await agent.didManagerGetOrCreate({alias: 'alice', provider: 'did:key'})
      const provider = new VeramoDidProvider(agent, alice.did)
      
      const resolver = { ...KeyDidResolver.getResolver() }
      const did = new DID({ provider, resolver })
      await did.authenticate()

      const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })

      expect(jws).toHaveProperty('payload')
      expect(jws).toHaveProperty('signatures')
      expect(linkedBlock).toBeInstanceOf(Uint8Array)

    })


    it('create TileDocument', async () => {
      const alice = await agent.didManagerGetOrCreate({alias: 'alice', provider: 'did:key'})
      const provider = new VeramoDidProvider(agent, alice.did)
      
      const resolver = { ...KeyDidResolver.getResolver() }
      const did = new DID({ provider, resolver })
      await did.authenticate()

      const ceramic = new CeramicClient(API_URL)
      ceramic.setDID(did)

      const content = { hello: 'from veramo' }
      const doc = await TileDocument.create(ceramic, content)

      const doc2 = await TileDocument.load(ceramic, doc.commitId)
      expect(doc2.content).toEqual(content)

    })
})
}
