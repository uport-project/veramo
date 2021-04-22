import { TAgent, IDIDManager, IDataStore, IIdentifier } from '../../packages/core/src'
import { IDataStoreORM } from '../../packages/data-store/src'
import { ICredentialIssuer } from '../../packages/credential-w3c/src'
import { IDIDComm } from '@veramo/did-comm'

type ConfiguredAgent = TAgent<IDIDManager & ICredentialIssuer & IDataStore & IDataStoreORM & IDIDComm>

export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('creating Verifiable Credentials in LD', () => {
    let agent: ConfiguredAgent
    let ethrIdentifier: IIdentifier
    let keyE256KIdentifier: IIdentifier
    let storedCredentialHash: string
    let challenge: string

    beforeAll(() => {
      testContext.setup()
      agent = testContext.getAgent()
      challenge = 'TEST_CHALLENGE_STRING'
    })
    afterAll(testContext.tearDown)

    it('should create ethr identifier', async () => {
      ethrIdentifier = await agent.didManagerCreate({ kms: 'local' })
      expect(ethrIdentifier).toHaveProperty('did')
    })

    it('should resolve identifier', async () => {
      const didDoc = (await agent.resolveDid({ didUrl: ethrIdentifier.did })).didDocument
      // console.log(JSON.stringify(didDoc, null, 2));
      expect(didDoc).toHaveProperty('verificationMethod')
    })


    it('should create verifiable credential in LD', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: ethrIdentifier.did },
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://veramo.io/contexts/profile/v1'
          ],
          type: ['VerifiableCredential', 'Profile'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            name: "Martin, the great"
          },
        },
        save: true,
        proofFormat: 'lds',
      })

      // Check credential:
      expect(verifiableCredential).toHaveProperty('proof')
      expect(verifiableCredential).toHaveProperty('proof.jws')
      expect(verifiableCredential.proof.verificationMethod).toEqual(`${ethrIdentifier.did}#controller`)

      expect(verifiableCredential['@context']).toEqual([
        'https://www.w3.org/2018/credentials/v1',
        'https://veramo.io/contexts/profile/v1',
        'https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld'
      ])
      expect(verifiableCredential['type']).toEqual(
        ['VerifiableCredential', 'Profile'])

      expect(await agent.dataStoreORMGetVerifiableCredentialsCount()).toEqual(1)

      storedCredentialHash = (await agent.dataStoreORMGetVerifiableCredentials())[0].hash

      const verifiableCredential2 = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })
      expect(verifiableCredential).toEqual(verifiableCredential2)
    })

    it('should verify a verifiable credential in LD', async () => {
      const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })

      // check that verification works
      const result = await agent.verifyVerifiableCredential({
        credential: verifiableCredential
      })

      expect(result).toEqual(true)
    })

    it('should handleMessage with VC (non-JWT)', async () => {
      const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })

      const parsedMessage = await agent.handleMessage({
        raw: JSON.stringify({
          body: verifiableCredential,
          type: 'w3c.vc'
        }),
        save: false,
        metaData: [{ type: 'LDS' }],
      })
      expect(typeof parsedMessage.id).toEqual('string')
    })

    it('should fail handleMessage with wrong VC (non-JWT)', async () => {
      expect.assertions(1);

      const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })

      verifiableCredential.credentialSubject.name = "Martin, the not so greats"

      try {
        await agent.handleMessage({
          raw: JSON.stringify({
            body: verifiableCredential,
            type: 'w3c.vc'
          }),
          save: false,
          metaData: [{ type: 'LDS' }],
        });
      } catch (e) {
        expect(e).toEqual(Error('Error verifying LD Verifiable Credential'));
      }
    })

    it('should sign a verifiable presentation in LD', async () => {
      const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })

      const verifiablePresentation = await agent.createVerifiablePresentation({
        presentation: {
          holder: ethrIdentifier.did,
          verifier: [],
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: [verifiableCredential],
        },
        challenge,
        // TODO: QueryFailedError: SQLITE_CONSTRAINT: NOT NULL constraint failed: presentation.issuanceDate
        // Currently LD Presentations are NEVER saved. (they have no issuanceDate)
        save: true,
        proofFormat: 'lds',
      })

      expect(verifiablePresentation).toHaveProperty('proof.jws')
    })


    it('should sign and verify a verifiable presentation in LD', async () => {
      const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })

      const domain = 'TEST_DOMAIN'
      const verifiablePresentation = await agent.createVerifiablePresentation({
        presentation: {
          holder: ethrIdentifier.did,
          verifier: [],
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: [verifiableCredential],
        },
        challenge,
        domain,
        proofFormat: 'lds',
      })

      // console.log(JSON.stringify(verifiablePresentation, null,  2))

      const result = await agent.verifyVerifiablePresentation({
        presentation: verifiablePresentation,
        challenge,
        domain
      })

      expect(result).toBeTruthy()
    })

    it('should handleMessage with VPs (non-JWT)', async () => {
      const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })

      const verifiablePresentation = await agent.createVerifiablePresentation({
        presentation: {
          holder: ethrIdentifier.did,
          verifier: [],
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: [verifiableCredential],
        },
        challenge: 'VERAMO',
        domain: 'VERAMO',
        proofFormat: 'lds',
      })

      const parsedMessage = await agent.handleMessage({
        raw: JSON.stringify({
          body: verifiablePresentation,
          type: 'w3c.vp'
        }),
        save: false,
        metaData: [{ type: 'LDS' }],
      })
      expect(typeof parsedMessage.id).toEqual('string')
    })

    it('should create did:key identifier', async () => {
      keyE256KIdentifier = await agent.didManagerCreate({ kms: 'local', provider: 'did:key' })
      expect(keyE256KIdentifier).toHaveProperty('did')
    })

    it('should create verifiable credential in LD with did:key', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: keyE256KIdentifier.did },
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://veramo.io/contexts/profile/v1'
          ],
          type: ['VerifiableCredential', 'Profile'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: keyE256KIdentifier.did,
            name: "Martin, the great"
          },
        },
        proofFormat: 'lds',
      })

      // Check credential:
      expect(verifiableCredential).toHaveProperty('proof')
      expect(verifiableCredential).toHaveProperty('proof.jws')
      expect(verifiableCredential.proof.verificationMethod).toEqual(`${keyE256KIdentifier.did}#${keyE256KIdentifier.did.substring(keyE256KIdentifier.did.lastIndexOf(':') + 1)}`)

      expect(verifiableCredential['@context']).toEqual([
        'https://www.w3.org/2018/credentials/v1',
        'https://veramo.io/contexts/profile/v1',
      ])
      expect(verifiableCredential['type']).toEqual(
        ['VerifiableCredential', 'Profile'])

      storedCredentialHash = await agent.dataStoreSaveVerifiableCredential({ verifiableCredential })
      expect(typeof storedCredentialHash).toEqual('string')

      const verifiableCredential2 = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })
      expect(verifiableCredential).toEqual(verifiableCredential2)
    })

    it('should verify a verifiable credential in LD with did:key', async () => {
      const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })

      console.log(JSON.stringify(verifiableCredential, null,  2))
      // check that verification works
      const result = await agent.verifyVerifiableCredential({
        credential: verifiableCredential
      })

      expect(result).toEqual(true)
    })


  })
}
