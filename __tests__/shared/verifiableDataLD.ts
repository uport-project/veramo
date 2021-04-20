import { TAgent, IDIDManager, IDataStore, IIdentifier } from '../../packages/core/src'
import { IDataStoreORM } from '../../packages/data-store/src'
import { ICredentialIssuer } from '../../packages/credential-w3c/src'

type ConfiguredAgent = TAgent<IDIDManager & ICredentialIssuer & IDataStore & IDataStoreORM>

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
      console.log(JSON.stringify(didDoc, null, 2));
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

      storedCredentialHash = await agent.dataStoreSaveVerifiableCredential({ verifiableCredential })
      expect(typeof storedCredentialHash).toEqual('string')

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

      console.log(JSON.stringify(verifiablePresentation, null,  2))

      const result = await agent.verifyVerifiablePresentation({
        presentation: verifiablePresentation,
        challenge,
        domain
      })

      expect(result).toBeTruthy()
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
      // console.log('JSON_CREDENTIAL:')
      // console.log(JSON.stringify({
      //   credential: {
      //     issuer: { id: keyE256KIdentifier.did },
      //     '@context': [
      //       'https://www.w3.org/2018/credentials/v1',
      //       'https://veramo.io/contexts/profile/v1'
      //     ],
      //     type: ['VerifiableCredential', 'Profile'],
      //     issuanceDate: new Date().toISOString(),
      //     credentialSubject: {
      //       id: keyE256KIdentifier.did,
      //       name: "Martin, the great"
      //     },
      //   },
      //   proofFormat: 'lds',
      // }, null,  2))

      // Check credential:
      expect(verifiableCredential).toHaveProperty('proof')
      expect(verifiableCredential).toHaveProperty('proof.proofValue')
      expect(verifiableCredential.proof.verificationMethod).toEqual(`${keyE256KIdentifier.did}#controller`)

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

    // it('should verify a verifiable credential in LD with did:key', async () => {
    //   const verifiableCredential = await agent.dataStoreGetVerifiableCredential({ hash: storedCredentialHash })
    //
    //   // check that verification works
    //   const result = await agent.verifyVerifiableCredential({
    //     credential: verifiableCredential
    //   })
    //
    //   expect(result).toEqual(true)
    // })

  })
}
