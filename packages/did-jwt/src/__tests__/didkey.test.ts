import { DIDResolutionResult } from '@veramo/core'
import { Message } from '@veramo/message-handler'
import { JwtMessageHandler, IContext } from '../message-handler'

describe('@veramo/did-jwt', () => {
  const vcJwt =
    'eyJhbGciOiJFZERTQSJ9.eyJleHAiOjE3NjQ4Nzg5MDgsImlzcyI6ImRpZDprZXk6ejZNa29USHNnTk5yYnk4SnpDTlExaVJMeVc1UVE2UjhYdXU2QUE4aWdHck1WUFVNIiwibmJmIjoxNjA3MTEyNTA4LCJzdWIiOiJkaWQ6a2V5Ono2TWtvVEhzZ05OcmJ5OEp6Q05RMWlSTHlXNVFRNlI4WHV1NkFBOGlnR3JNVlBVTSIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9pZGVudGl0eS5mb3VuZGF0aW9uLy53ZWxsLWtub3duL2RpZC1jb25maWd1cmF0aW9uL3YxIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6Nk1rb1RIc2dOTnJieThKekNOUTFpUkx5VzVRUTZSOFh1dTZBQThpZ0dyTVZQVU0iLCJvcmlnaW4iOiJpZGVudGl0eS5mb3VuZGF0aW9uIn0sImV4cGlyYXRpb25EYXRlIjoiMjAyNS0xMi0wNFQxNDowODoyOC0wNjowMCIsImlzc3VhbmNlRGF0ZSI6IjIwMjAtMTItMDRUMTQ6MDg6MjgtMDY6MDAiLCJpc3N1ZXIiOiJkaWQ6a2V5Ono2TWtvVEhzZ05OcmJ5OEp6Q05RMWlSTHlXNVFRNlI4WHV1NkFBOGlnR3JNVlBVTSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJEb21haW5MaW5rYWdlQ3JlZGVudGlhbCJdfX0.6ovgQ-T_rmYueviySqXhzMzgqJMAizOGUKAObQr2iikoRNsb8DHfna4rh1puwWqYwgT3QJVpzdO_xZARAYM9Dw'

  const context: IContext = {
    agent: {
      getSchema: jest.fn(),
      execute: jest.fn(),
      availableMethods: jest.fn(),
      emit: jest.fn(),
      resolveDid: async (args?): Promise<DIDResolutionResult> => {
        if (!args?.didUrl) throw Error('DID required')

        return {
          didDocumentMetadata: {},
          didResolutionMetadata: {},
          didDocument: {
            '@context': 'https://w3id.org/did/v1',
            id: 'did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM',
            publicKey: [
              {
                id: 'did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM#z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM',
                type: 'Ed25519VerificationKey2018',
                controller: 'did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM',
                publicKeyBase58: 'A12q688RGRdqshXhL9TW8QXQaX9H82ejU9DnqztLaAgy',
              },
            ],
          },
        }
      },
      getDIDComponentById: jest.fn(),
    },
  }

  it('should handle EdDsa jwt', async () => {
    const mockNextHandler = {
      setNext: jest.fn(),
      handle: jest.fn().mockResolvedValue(true),
    }
    const handler = new JwtMessageHandler()
    handler.setNext(mockNextHandler)

    const message = new Message({ raw: vcJwt, metaData: [{ type: 'test' }] })
    await handler.handle(message, context)
    expect(mockNextHandler.handle).toBeCalledWith(
      expect.objectContaining({
        raw: vcJwt,
        data: {
          exp: 1764878908,
          iss: 'did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM',
          nbf: 1607112508,
          sub: 'did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM',
          vc: {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://identity.foundation/.well-known/did-configuration/v1',
            ],
            credentialSubject: {
              id: 'did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM',
              origin: 'identity.foundation',
            },
            expirationDate: '2025-12-04T14:08:28-06:00',
            issuanceDate: '2020-12-04T14:08:28-06:00',
            issuer: 'did:key:z6MkoTHsgNNrby8JzCNQ1iRLyW5QQ6R8Xuu6AA8igGrMVPUM',
            type: ['VerifiableCredential', 'DomainLinkageCredential'],
          },
        },
        metaData: [{ type: 'test' }, { type: 'JWT', value: 'EdDSA' }],
      }),
      context,
    )
  })
})
