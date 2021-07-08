import { TAgent, IDIDManager, IIdentifier, IDataStore, IMessageHandler } from '../../packages/core/src'
import { ICredentialIssuer } from '../../packages/credential-w3c/src'
import { ISelectiveDisclosure, SelectiveDisclosure } from '../../packages/selective-disclosure/src'
import { IDataStoreORM } from '../../packages/data-store/src'

type ConfiguredAgent = TAgent<
  IDIDManager & ICredentialIssuer & IDataStoreORM & IDataStore & IMessageHandler & ISelectiveDisclosure
>

export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('handling sdr message', () => {
    let agent: ConfiguredAgent
    let identifier: IIdentifier
    let JWT: string
    let originalRequestSender: string
    let sdr: SelectiveDisclosure

    beforeAll(() => {
      testContext.setup()
      agent = testContext.getAgent()
    })
    afterAll(testContext.tearDown)

    it('should create identifier', async () => {
      identifier = await agent.didManagerCreate({ kms: 'local' })
      expect(identifier).toHaveProperty('did')
    })

    it('should create verifiable credential', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:web:uport.me',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
      })

      expect(verifiableCredential).toHaveProperty('proof.jwt')
    })

    it('should save an SDR message', async () => {
      JWT = await agent.createSelectiveDisclosureRequest({
        data: {
          issuer: identifier.did,
          tag: 'sdr-one',
          claims: [
            {
              reason: 'We need it',
              claimType: 'name',
              essential: true,
            },
          ],
        },
      })

      const message = await agent.handleMessage({
        raw: JWT,
        save: true,
      })
      if (message.from) {
        originalRequestSender = message.from
      }

      expect(message.raw).toEqual(JWT)
    })

    it('should be able to find the request message', async () => {
      const messages = await agent.dataStoreORMGetMessages()

      expect(messages[0].raw).toEqual(JWT)
      expect(messages[0].type).toEqual('sdr')
    })

    it('should be able to sign a credential after saving a message', async () => {
      const identifiers = await agent.didManagerFind()
      const identifier = identifiers[0]

      expect(identifiers[0].did).toBeDefined()

      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:web:uport.me',
            name: 'Carrot',
          },
        },
        proofFormat: 'jwt',
        save: true,
      })

      expect(verifiableCredential.proof.jwt).toBeDefined()
    })

    it('should accept empty issuers array', async () => {
      const credentials = await agent.getVerifiableCredentialsForSdr({
        sdr: {
          claims: [
            {
              claimType: 'name',
              issuers: [],
            },
          ],
        },
      })

      expect(credentials[0].credentials[0]).toHaveProperty('hash')
      expect(credentials[0].credentials[0]).toHaveProperty('verifiableCredential.proof.jwt')
    })

    it('should create verifiable presentation', async () => {
      const credentials = await agent.getVerifiableCredentialsForSdr({
        sdr: {
          claims: [
            {
              claimType: 'name',
            },
          ],
        },
      })

      const verifiablePresentation = await agent.createVerifiablePresentation({
        presentation: {
          verifier: [originalRequestSender],
          holder: identifier.did,
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          issuanceDate: new Date().toISOString(),
          verifiableCredential: credentials[0].credentials.map((c) => c.verifiableCredential),
        },
        proofFormat: 'jwt',
        save: true,
      })

      expect(verifiablePresentation).toHaveProperty('proof.jwt')

      const validated = await agent.validatePresentationAgainstSdr({
        presentation: verifiablePresentation,
        sdr: {
          issuer: '',
          claims: [
            {
              claimType: 'name',
            },
          ],
        },
      })
      expect(validated.valid).toEqual(true)
    })
  })
}
