import { DIDDocument, DIDResolutionResult } from '@veramo/core'
import { Message } from '@veramo/message-handler'
import { W3cMessageHandler, MessageTypes } from '../index'
import { IContext } from '../message-handler'
import { blake2bHex } from 'blakejs'

describe('@veramo/credential-w3c', () => {
  const vcJwt =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODI2MTk2NzYsInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHgzYzM1N2JhNDU4OTMzYTE5YzFkZjFjN2Y2YjQ3M2IzMzAyYmJiZTYxIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiQWxpY2UifX0sImlzcyI6ImRpZDpldGhyOnJpbmtlYnk6MHgzYzM1N2JhNDU4OTMzYTE5YzFkZjFjN2Y2YjQ3M2IzMzAyYmJiZTYxIn0.IGF1LFOc4_PcGVeq7Yw7OGz4Gj7xXZK6p8bP9CSEIXz7mNFPM0v0nuevTZ47a0I8XgLfCFNkUrIIscjH8MFx_wE'

  const vcPayload = {
    iat: 1582619676,
    sub: 'did:ethr:rinkeby:0x3c357ba458933a19c1df1c7f6b473b3302bbbe61',
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
        name: 'Alice',
      },
    },
    iss: 'did:ethr:rinkeby:0x3c357ba458933a19c1df1c7f6b473b3302bbbe61',
  }

  const vpJwt =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODI2MTk4NzUsImF1ZCI6ImRpZDpldGhyOnJpbmtlYnk6MHgzYzM1N2JhNDU4OTMzYTE5YzFkZjFjN2Y2YjQ3M2IzMzAyYmJiZTYxIiwidGFnIjoieHl6LTEyMyIsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5rc3RVaUo5LmV5SnBZWFFpT2pFMU9ESTJNVGsyTnpZc0luTjFZaUk2SW1ScFpEcGxkR2h5T25KcGJtdGxZbms2TUhnell6TTFOMkpoTkRVNE9UTXpZVEU1WXpGa1pqRmpOMlkyWWpRM00ySXpNekF5WW1KaVpUWXhJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lkSGx3WlNJNld5SldaWEpwWm1saFlteGxRM0psWkdWdWRHbGhiQ0pkTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SnVZVzFsSWpvaVFXeHBZMlVpZlgwc0ltbHpjeUk2SW1ScFpEcGxkR2h5T25KcGJtdGxZbms2TUhnell6TTFOMkpoTkRVNE9UTXpZVEU1WXpGa1pqRmpOMlkyWWpRM00ySXpNekF5WW1KaVpUWXhJbjAuSUdGMUxGT2M0X1BjR1ZlcTdZdzdPR3o0R2o3eFhaSzZwOGJQOUNTRUlYejdtTkZQTTB2MG51ZXZUWjQ3YTBJOFhnTGZDRk5rVXJJSXNjakg4TUZ4X3dFIl19LCJpc3MiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4M2MzNTdiYTQ1ODkzM2ExOWMxZGYxYzdmNmI0NzNiMzMwMmJiYmU2MSJ9.7gIGq437moBKMwF3PUrycjCP4Op6dL6IJV6GygSq1KGV7QU0II16YzETsr412AlHl_kaYgUJjRav7unJdyJL0wA'

  const vpPayload = {
    iat: 1582619875,
    aud: 'did:ethr:rinkeby:0x3c357ba458933a19c1df1c7f6b473b3302bbbe61',
    tag: 'xyz-123',
    vp: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODI2MTk2NzYsInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHgzYzM1N2JhNDU4OTMzYTE5YzFkZjFjN2Y2YjQ3M2IzMzAyYmJiZTYxIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiQWxpY2UifX0sImlzcyI6ImRpZDpldGhyOnJpbmtlYnk6MHgzYzM1N2JhNDU4OTMzYTE5YzFkZjFjN2Y2YjQ3M2IzMzAyYmJiZTYxIn0.IGF1LFOc4_PcGVeq7Yw7OGz4Gj7xXZK6p8bP9CSEIXz7mNFPM0v0nuevTZ47a0I8XgLfCFNkUrIIscjH8MFx_wE',
      ],
    },
    iss: 'did:ethr:rinkeby:0x3c357ba458933a19c1df1c7f6b473b3302bbbe61',
  }

  const vpMultiAudJwt =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODg2NzY3MzksInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5rc3RVaUo5LmV5SnBZWFFpT2pFMU9ESTJNVGsyTnpZc0luTjFZaUk2SW1ScFpEcGxkR2h5T25KcGJtdGxZbms2TUhnell6TTFOMkpoTkRVNE9UTXpZVEU1WXpGa1pqRmpOMlkyWWpRM00ySXpNekF5WW1KaVpUWXhJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lkSGx3WlNJNld5SldaWEpwWm1saFlteGxRM0psWkdWdWRHbGhiQ0pkTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SnVZVzFsSWpvaVFXeHBZMlVpZlgwc0ltbHpjeUk2SW1ScFpEcGxkR2h5T25KcGJtdGxZbms2TUhnell6TTFOMkpoTkRVNE9UTXpZVEU1WXpGa1pqRmpOMlkyWWpRM00ySXpNekF5WW1KaVpUWXhJbjAuSUdGMUxGT2M0X1BjR1ZlcTdZdzdPR3o0R2o3eFhaSzZwOGJQOUNTRUlYejdtTkZQTTB2MG51ZXZUWjQ3YTBJOFhnTGZDRk5rVXJJSXNjakg4TUZ4X3dFIl19LCJ0YWciOiJ0YWcxMjMiLCJhdWQiOlsiZGlkOmV4YW1wbGU6MzQ1NiIsImRpZDp3ZWI6dXBvcnQubWUiXSwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweGIwOWI2NjAyNmJhNTkwOWE3Y2ZlOTliNzY4NzU0MzFkMmI4ZDUxOTAifQ.4SWpp8siCBHP47KrOT_28IJIQPZLCWO9VS0Ir-VVYOGUAVj7vHtXLxl3Y6lLAxYeNqWrRPCAVkDArBFCNRjYUgA'

  const vpMultiAudPayload = {
    iat: 1588676739,
    vp: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODI2MTk2NzYsInN1YiI6ImRpZDpldGhyOnJpbmtlYnk6MHgzYzM1N2JhNDU4OTMzYTE5YzFkZjFjN2Y2YjQ3M2IzMzAyYmJiZTYxIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiQWxpY2UifX0sImlzcyI6ImRpZDpldGhyOnJpbmtlYnk6MHgzYzM1N2JhNDU4OTMzYTE5YzFkZjFjN2Y2YjQ3M2IzMzAyYmJiZTYxIn0.IGF1LFOc4_PcGVeq7Yw7OGz4Gj7xXZK6p8bP9CSEIXz7mNFPM0v0nuevTZ47a0I8XgLfCFNkUrIIscjH8MFx_wE',
      ],
    },
    tag: 'tag123',
    aud: ['did:example:3456', 'did:web:uport.me'],
    iss: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
  }

  const handler = new W3cMessageHandler()

  const context: IContext = {
    agent: {
      getSchema: jest.fn(),
      execute: jest.fn(),
      availableMethods: jest.fn(),
      emit: jest.fn(),
      resolveDid: async (args?): Promise<DIDResolutionResult> => {
        if (!args?.didUrl) throw Error('DID required')

        return {
          didResolutionMetadata: {},
          didDocumentMetadata: {},
          didDocument: {
            '@context': 'https://w3id.org/did/v1',
            id: args?.didUrl,
            verificationMethod: [
              {
                id: `${args?.didUrl}#owner`,
                type: 'EcdsaSecp256k1RecoveryMethod2020',
                controller: args?.didUrl,
                blockchainAccountId: `${args?.didUrl.slice(-42)}@eip155:1`,
              },
            ],
            authentication: [`${args?.didUrl}#owner`],
          },
        }
      },
      createVerifiableCredential: jest.fn(),
      createVerifiablePresentation: jest.fn(),
      verifyVerifiableCredential: jest.fn(),
      verifyVerifiablePresentation: jest.fn(),
    },
  }

  it('should reject unknown message type', async () => {
    const message = new Message({ raw: 'test', metaData: [{ type: 'test' }] })
    await expect(handler.handle(message, context)).rejects.toThrow('Unsupported message type')
  })

  it('should return handled VC message', async () => {
    const message = new Message({ raw: vcJwt, metaData: [{ type: 'test' }] })
    // This would be done by '@veramo/did-jwt':
    message.data = vcPayload
    message.addMetaData({ type: 'JWT', value: 'ES256K-R' })
    const handled = await handler.handle(message, context)
    expect(handled.isValid()).toEqual(true)
    expect(handled.id).toEqual(blake2bHex(vcJwt))
    expect(handled.raw).toEqual(vcJwt)
    expect(handled.type).toEqual(MessageTypes.vc)
    expect(handled.from).toEqual(vcPayload.iss)
    expect(handled.to).toEqual(vcPayload.sub)
    // expect(handled.timestamp).toEqual(vcPayload.iat)
  })

  it('should return handled VP message', async () => {
    const message = new Message({ raw: vpJwt, metaData: [{ type: 'test' }] })
    // This would be done by '@veramo/did-jwt':
    message.data = vpPayload
    message.addMetaData({ type: 'JWT', value: 'ES256K-R' })

    const handled = await handler.handle(message, context)
    expect(handled.isValid()).toEqual(true)
    expect(handled.id).toEqual(blake2bHex(vpJwt))
    expect(handled.raw).toEqual(vpJwt)
    expect(handled.type).toEqual(MessageTypes.vp)
    expect(handled.from).toEqual(vpPayload.iss)
    expect(handled.to).toEqual(vpPayload.aud)
    expect(handled.threadId).toEqual(vpPayload.tag)
    // expect(handled.timestamp).toEqual(vpPayload.iat)
  })

  it('should use the first audience did as a message.to field', async () => {
    const message = new Message({ raw: vpMultiAudJwt, metaData: [{ type: 'test' }] })
    // This would be done by '@veramo/did-jwt':
    message.data = vpMultiAudPayload
    message.addMetaData({ type: 'JWT', value: 'ES256K-R' })

    const handled = await handler.handle(message, context)
    expect(handled.isValid()).toEqual(true)
    expect(handled.id).toEqual(blake2bHex(vpMultiAudJwt))
    expect(handled.raw).toEqual(vpMultiAudJwt)
    expect(handled.type).toEqual(MessageTypes.vp)
    expect(handled.from).toEqual(vpMultiAudPayload.iss)
    expect(handled.to).toEqual(vpMultiAudPayload.aud[0])
    expect(handled.threadId).toEqual(vpMultiAudPayload.tag)
  })

  it('should return handled VC message with credentialStatus', async () => {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODgyNDkyNTgsInN1YiI6ImRpZDp3ZWI6dXBvcnQubWUiLCJub25jZSI6IjM4NzE4Njc0NTMiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiQXdlc29tZW5lc3NDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7Iml0IjoicmVhbGx5IHdoaXBzIHRoZSBsbGFtbWEncyBhc3MhIn19LCJjcmVkZW50aWFsU3RhdHVzIjp7InR5cGUiOiJFdGhyU3RhdHVzUmVnaXN0cnkyMDE5IiwiaWQiOiJyaW5rZWJ5OjB4OTdmZDI3ODkyY2RjRDAzNWRBZTFmZTcxMjM1YzYzNjA0NEI1OTM0OCJ9LCJpc3MiOiJkaWQ6ZXRocjoweDU0ZDU5ZTNmZmQ3NjkxN2Y2MmRiNzAyYWMzNTRiMTdmMzg0Mjk1NWUifQ.mtMt6-sJdaKH_sPUFPan1FzvWPtlrdKLRCHrh1aOS_zSVyTGHynA0-5AHcEujB1Rz1SuzuM3rkhHRO8eX2IAYg'
    const message = new Message({
      raw: token,
      metaData: [{ type: 'test' }],
    })
    // This would be done by '@veramo/did-jwt':
    message.data = {
      iat: 1588249258,
      sub: 'did:web:uport.me',
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'AwesomenessCredential'],
        credentialSubject: {
          it: "really whips the llamma's ass!",
        },
      },
      credentialStatus: {
        type: 'EthrStatusRegistry2019',
        id: 'rinkeby:0x97fd27892cdcD035dAe1fe71235c636044B59348',
      },
      iss: 'did:ethr:0x54d59e3ffd76917f62db702ac354b17f3842955e',
    }
    message.addMetaData({ type: 'JWT', value: 'ES256K' })

    const handled = await handler.handle(message, context)

    expect(handled.isValid()).toEqual(true)
    expect(handled.id).toEqual(blake2bHex(token))
    expect(handled.raw).toEqual(token)
    expect(handled.type).toEqual(MessageTypes.vc)
    expect(handled.from).toEqual('did:ethr:0x54d59e3ffd76917f62db702ac354b17f3842955e')
    expect(handled.to).toEqual('did:web:uport.me')
  })
})
