import { IAgentContext, IDIDManager, IKeyManager, TAgent } from '@veramo/core'
import type { HandlerMethods, RPCRequest, RPCResponse, SendRequestFunc } from 'rpc-utils'
import { createJWS } from 'did-jwt'
import type {
  AuthParams,
  CreateJWSParams,
  DecryptJWEParams,
  DIDMethodName,
  DIDProviderMethods,
  DIDProvider,
  GeneralJWS,
} from 'dids'
import stringify from 'fast-json-stable-stringify'
import { RPCError, createHandler } from 'rpc-utils'


import Debug from 'debug'
const debug = Debug('veramo:ceramic:provider')


function toStableObject(obj: Record<string, any>): Record<string, any> {
  return JSON.parse(stringify(obj)) as Record<string, any>
}


function toGeneralJWS(jws: string): GeneralJWS {
  const [protectedHeader, payload, signature] = jws.split('.')
  return {
    payload,
    signatures: [{ protected: protectedHeader, signature }],
  }
}

interface Context {
  did: string
  agent: TAgent<IDIDManager & IKeyManager>
}

const sign = async (
  payload: Record<string, any>,
  did: string,
  agent: TAgent<IDIDManager & IKeyManager>,
  protectedHeader: Record<string, any> = {}
) => {

  const identifier = await agent.didManagerGet({ did })
  const key = identifier.keys.find((k) => k.type === 'Secp256k1' || k.type === 'Ed25519')
  if (!key) throw Error('No signing key for ' + identifier.did)
  const signer = (data: string | Uint8Array) => agent.keyManagerSignJWT({ kid: key.kid, data })

  const kid = `${did}#${did.split(':')[2]}`
  const header = toStableObject(Object.assign(protectedHeader, { kid, alg: 'EdDSA' }))
  return createJWS(toStableObject(payload), signer, header)
}

const didMethods: HandlerMethods<Context, DIDProviderMethods> = {
  did_authenticate: async ({ did, agent }, params: AuthParams) => {
    const response = await sign(
      {
        did,
        aud: params.aud,
        nonce: params.nonce,
        paths: params.paths,
        exp: Math.floor(Date.now() / 1000) + 600, // expires 10 min from now
      },
      did,
      agent
    )
    return toGeneralJWS(response)
  },
  did_createJWS: async ({ did, agent }, params: CreateJWSParams & { did: string }) => {
    const requestDid = params.did.split('#')[0]
    if (requestDid !== did) throw new RPCError(4100, `Unknown DID: ${did}`)
    const jws = await sign(params.payload, did, agent, params.protected)
    return { jws: toGeneralJWS(jws) }
  },
  did_decryptJWE: async ({ agent }, params: DecryptJWEParams) => {
    // const decrypter = x25519Decrypter(convertSecretKeyToX25519(secretKey))
    try {
      // const bytes = await decryptJWE(params.jwe, decrypter)
      // return { cleartext: u8a.toString(bytes, B64) }
      throw Error('did_decryptJWE not implemented')
    } catch (e) {
      throw new RPCError(-32000, (e as Error).message)
    }
  },
}

export class VeramoDidProvider implements DIDProvider {
  _handle: SendRequestFunc<DIDProviderMethods>

  constructor(private agent: TAgent<IDIDManager & IKeyManager>, private did: string) {
    const handler = createHandler<Context, DIDProviderMethods>(didMethods)
    this._handle = async (msg) => await handler({ did, agent }, msg)

  }
  get isDidProvider(): boolean {
    return true
  }

  async send<Name extends DIDMethodName>(
    msg: RPCRequest<DIDProviderMethods, Name>
  ): Promise<RPCResponse<DIDProviderMethods, Name> | null> {
    debug(msg)
    return await this._handle(msg)
  }
}
