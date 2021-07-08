import { TAgent, IDIDManager, IIdentifier, IDataStore } from '../../packages/core/src'
import { IDataStoreORM } from '../../packages/data-store/src'
import { ICredentialIssuer } from '../../packages/credential-w3c/src'
import { decodeJWT } from 'did-jwt'
import { TKeyType } from '@veramo/core'

type ConfiguredAgent = TAgent<IDIDManager & ICredentialIssuer & IDataStore & IDataStoreORM>

export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('creating Verifiable Credentials in JWT', () => {
    let agent: ConfiguredAgent
    let identifier: IIdentifier

    beforeAll(() => {
      testContext.setup()
      agent = testContext.getAgent()
    })
    afterAll(testContext.tearDown)

    it('should create identifier', async () => {
      identifier = await agent.didManagerCreate({ kms: 'local' })
      expect(identifier).toHaveProperty('did')
    })

    it('should create verifiable credential in JWT', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          '@context': ['https://www.w3.org/2018/credentials/v1', 'https://example.com/1/2/3'],
          type: ['VerifiableCredential', 'Custom'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:web:example.com',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
      })

      expect(verifiableCredential).toHaveProperty('proof.jwt')
      expect(verifiableCredential['@context']).toEqual([
        'https://www.w3.org/2018/credentials/v1',
        'https://example.com/1/2/3',
      ])
      expect(verifiableCredential['type']).toEqual(['VerifiableCredential', 'Custom'])

      const hash = await agent.dataStoreSaveVerifiableCredential({ verifiableCredential })
      expect(typeof hash).toEqual('string')

      const verifiableCredential2 = await agent.dataStoreGetVerifiableCredential({ hash })
      expect(verifiableCredential).toEqual(verifiableCredential2)
    })

    it('should create verifiable credential (simple)', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          credentialSubject: {
            id: 'did:web:example.com',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
      })

      expect(verifiableCredential).toHaveProperty('proof.jwt')
      expect(verifiableCredential).toHaveProperty('issuanceDate')
      expect(verifiableCredential['@context']).toEqual(['https://www.w3.org/2018/credentials/v1'])
      expect(verifiableCredential['type']).toEqual(['VerifiableCredential'])

      const token = verifiableCredential.proof.jwt
      const { payload } = decodeJWT(token)
      expect(payload.vc.credentialSubject.id).not.toBeDefined()
    })

    it('should create verifiable credential keeping original fields', async () => {
      expect.assertions(5)
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          credentialSubject: {
            id: 'did:web:example.com',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
        removeOriginalFields: false,
      })

      expect(verifiableCredential).toHaveProperty('proof.jwt')
      expect(verifiableCredential).toHaveProperty('issuanceDate')
      expect(verifiableCredential['@context']).toEqual(['https://www.w3.org/2018/credentials/v1'])
      expect(verifiableCredential['type']).toEqual(['VerifiableCredential'])

      const token = verifiableCredential.proof.jwt
      const { payload } = decodeJWT(token)
      expect(payload.vc.credentialSubject.id).toEqual('did:web:example.com')
    })

    it('should create verifiable presentation', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:web:example.com',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
      })

      const verifiablePresentation = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier.did,
          verifier: [],
          '@context': ['https://www.w3.org/2018/credentials/v1', 'https://example.com/1/2/3'],
          type: ['VerifiablePresentation', 'Custom'],
          issuanceDate: new Date().toISOString(),
          verifiableCredential: [verifiableCredential],
        },
        proofFormat: 'jwt',
      })

      expect(verifiablePresentation).toHaveProperty('proof.jwt')
      expect(verifiablePresentation['@context']).toEqual([
        'https://www.w3.org/2018/credentials/v1',
        'https://example.com/1/2/3',
      ])
      expect(verifiablePresentation['type']).toEqual(['VerifiablePresentation', 'Custom'])

      const hash = await agent.dataStoreSaveVerifiablePresentation({ verifiablePresentation })
      expect(typeof hash).toEqual('string')

      const verifiablePresentation2 = await agent.dataStoreGetVerifiablePresentation({ hash })
      expect(verifiablePresentation).toEqual(verifiablePresentation2)
    })

    it('should create verifiable presentation (simple)', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          credentialSubject: {
            id: 'did:web:example.com',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
      })

      const verifiablePresentation = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier.did,
          verifier: [],
          verifiableCredential: [verifiableCredential],
        },
        proofFormat: 'jwt',
      })

      expect(verifiablePresentation).toHaveProperty('proof.jwt')
      expect(verifiablePresentation['@context']).toEqual(['https://www.w3.org/2018/credentials/v1'])
      expect(verifiablePresentation['type']).toEqual(['VerifiablePresentation'])

      const hash = await agent.dataStoreSaveVerifiablePresentation({ verifiablePresentation })
      expect(typeof hash).toEqual('string')

      const verifiablePresentation2 = await agent.dataStoreGetVerifiablePresentation({ hash })
      expect(verifiablePresentation).toEqual(verifiablePresentation2)

      const token = verifiablePresentation.proof.jwt
      const { payload } = decodeJWT(token)
      expect(payload.holder).not.toBeDefined()
    })

    it('should create verifiable presentation (simple) keeping original fields', async () => {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifier.did },
          credentialSubject: {
            id: 'did:web:example.com',
            you: 'Rock',
          },
        },
        proofFormat: 'jwt',
      })

      const verifiablePresentation = await agent.createVerifiablePresentation({
        presentation: {
          holder: identifier.did,
          verifier: [],
          verifiableCredential: [verifiableCredential],
        },
        proofFormat: 'jwt',
        removeOriginalFields: false,
      })

      expect(verifiablePresentation).toHaveProperty('proof.jwt')
      expect(verifiablePresentation['@context']).toEqual(['https://www.w3.org/2018/credentials/v1'])
      expect(verifiablePresentation['type']).toEqual(['VerifiablePresentation'])

      const token = verifiablePresentation.proof.jwt
      const { payload } = decodeJWT(token)
      expect(payload.holder).toEqual(identifier.did)
    })

    it('should query for credentials', async () => {
      const allCredentials = await agent.dataStoreORMGetVerifiableCredentials({})
      expect(allCredentials[0]).toHaveProperty('hash')
      expect(allCredentials[0]).toHaveProperty('verifiableCredential')
      const credentialCount = await agent.dataStoreORMGetVerifiableCredentialsCount()
      expect(allCredentials.length).toEqual(credentialCount)
    })

    it('should query for presentations', async () => {
      const allPresentations = await agent.dataStoreORMGetVerifiablePresentations({})
      expect(allPresentations[0]).toHaveProperty('hash')
      expect(allPresentations[0]).toHaveProperty('verifiablePresentation')
      const presentationCount = await agent.dataStoreORMGetVerifiablePresentationsCount()
      expect(allPresentations.length).toEqual(presentationCount)
    })

    it('should throw error for non existing verifiable credential', async () => {
      await expect(
        agent.dataStoreGetVerifiableCredential({
          hash: 'foobar',
        }),
      ).rejects.toThrow('Verifiable credential not found')
    })

    it('should throw error for non existing verifiable presentation', async () => {
      await expect(
        agent.dataStoreGetVerifiablePresentation({
          hash: 'foobar',
        }),
      ).rejects.toThrow('Verifiable presentation not found')
    })

    describe('using testvectors', () => {
      const importedDID = {
        did: 'did:ethr:rinkeby:0x03155ee0cbefeecd80de63a62b4ed8f0f97ac22a58f76a265903b9acab79bf018c',
        provider: 'did:ethr:rinkeby',
        controllerKeyId:
          '04155ee0cbefeecd80de63a62b4ed8f0f97ac22a58f76a265903b9acab79bf018c7037e2bd897812170c92a4c978d6a10481491a37299d74c4bd412a111a4ac875',
        keys: [
          {
            kid: '04155ee0cbefeecd80de63a62b4ed8f0f97ac22a58f76a265903b9acab79bf018c7037e2bd897812170c92a4c978d6a10481491a37299d74c4bd412a111a4ac875',
            kms: 'local',
            type: <TKeyType>'Secp256k1',
            publicKeyHex:
              '04155ee0cbefeecd80de63a62b4ed8f0f97ac22a58f76a265903b9acab79bf018c7037e2bd897812170c92a4c978d6a10481491a37299d74c4bd412a111a4ac875',
            privateKeyHex: '31d1ec15ff8110442012fef0d1af918c0e09b2e2ab821bba52ecc85f8655ec63',
          },
        ],
        services: [],
      }

      beforeAll(async () => {
        const imported = await agent.didManagerImport(importedDID)
      })

      it('signs JWT with ES256K', async () => {
        const credentialInput = {
          credentialSubject: { id: 'did:example:subject', name: 'Alice' },
          issuer: { id: importedDID.did },
        }
        const { proof, issuanceDate, ...comparableOutput } = await agent.createVerifiableCredential({
          credential: credentialInput,
          proofFormat: 'jwt',
          save: false,
          removeOriginalFields: true,
        })
        expect(comparableOutput).toEqual({
          credentialSubject: { name: 'Alice', id: 'did:example:subject' },
          issuer: {
            id: 'did:ethr:rinkeby:0x03155ee0cbefeecd80de63a62b4ed8f0f97ac22a58f76a265903b9acab79bf018c',
          },
          type: ['VerifiableCredential'],
          '@context': ['https://www.w3.org/2018/credentials/v1'],
        })
      })
    })
  })
}
