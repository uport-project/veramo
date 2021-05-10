import { DIDResolverPlugin } from '../resolver'
import { Resolver } from 'did-resolver'
import { getResolver as getEthrResolver } from 'ethr-did-resolver'
import { getResolver as getWebDidResolver } from 'web-did-resolver'
import { getUniversalResolverFor } from '../universal-resolver'

const providerConfig = {
  networks: [
    { name: 'rinkeby', rpcUrl: 'https://rinkeby.infura.io/v3/6b734e0b04454df8a6ce234023c04f26' },
    { name: 'development', rpcUrl: 'http://localhost:7545' },
    //FIXME: add this example
    // { name: 'test', provider: TBD_add_example_of_custom_provider_usage },
  ],
}

/** This creates a resolver that supports the [ethr, web, key, elem] DID methods */
let resolver: Resolver = new Resolver({
  //resolve did:ethr using the embedded ethr-did-resolver
  ...getEthrResolver(providerConfig),
  //resolve did:web using the embedded web-did-resolver
  ...getWebDidResolver(),
  //resolve some other DID methods using the centralized `uniresolver.io` service
  ...getUniversalResolverFor(['key', 'elem']),
})

let resolverPlugin: DIDResolverPlugin = new DIDResolverPlugin({ resolver })

describe('@veramo/did-resolver', () => {
  beforeAll(() => {})

  it('should resolve web DID', async () => {
    expect.assertions(1)
    await expect(resolverPlugin.resolveDid({ didUrl: 'did:web:did.actor:alice' })).resolves.toEqual({
      didDocument: {
        '@context': 'https://w3id.org/did/v0.11',
        id: 'did:web:did.actor:alice',
        publicKey: [
          {
            id: 'did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN',
            controller: 'did:web:did.actor:alice',
            type: 'Ed25519VerificationKey2018',
            publicKeyBase58: 'DK7uJiq9PnPnj7AmNZqVBFoLuwTjT1hFPrk6LSjZ2JRz',
          },
        ],
        authentication: ['did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN'],
        assertionMethod: ['did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN'],
        capabilityDelegation: ['did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN'],
        capabilityInvocation: ['did:web:did.actor:alice#z6MkrmNwty5ajKtFqc1U48oL2MMLjWjartwc5sf2AihZwXDN'],
        keyAgreement: [
          {
            id: 'did:web:did.actor:alice#zC8GybikEfyNaausDA4mkT4egP7SNLx2T1d1kujLQbcP6h',
            type: 'X25519KeyAgreementKey2019',
            controller: 'did:web:did.actor:alice',
            publicKeyBase58: 'CaSHXEvLKS6SfN9aBfkVGBpp15jSnaHazqHgLHp8KZ3Y',
          },
        ],
      },
      didDocumentMetadata: {},
      didResolutionMetadata: { contentType: 'application/did+ld+json' },
    })
  })

  it('should resolve ethr-did with RPC URL', async () => {
    expect.assertions(1)
    await expect(
      resolverPlugin.resolveDid({ didUrl: 'did:ethr:rinkeby:0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6' }),
    ).resolves.toEqual({
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld',
        ],
        id: 'did:ethr:rinkeby:0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6',
        verificationMethod: [
          {
            id: 'did:ethr:rinkeby:0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6#controller',
            type: 'EcdsaSecp256k1RecoveryMethod2020',
            controller: 'did:ethr:rinkeby:0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6',
            blockchainAccountId: '0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6@eip155:4',
          },
        ],
        authentication: ['did:ethr:rinkeby:0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6#controller'],
        assertionMethod: ['did:ethr:rinkeby:0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6#controller'],
      },
      didDocumentMetadata: {},
      didResolutionMetadata: { contentType: 'application/did+ld+json' },
    })
  })

  it('should resolve did:key using uniresolver', async () => {
    expect.assertions(1)
    const { didDocument } = await resolverPlugin.resolveDid({
      didUrl: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
    })
    expect(didDocument).toEqual({
      '@context': ['https://w3id.org/did/v0.11'],
      id: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
      publicKey: [
        {
          id:
            'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6#z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
          type: 'Ed25519VerificationKey2018',
          controller: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
          publicKeyBase58: '2QTnR7atrFu3Y7S6Xmmr4hTsMaL1KDh6Mpe9MgnJugbi',
        },
      ],
      authentication: [
        'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6#z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
      ],
      assertionMethod: [
        'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6#z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
      ],
      capabilityDelegation: [
        'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6#z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
      ],
      capabilityInvocation: [
        'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6#z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
      ],
      keyAgreement: [
        {
          id:
            'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6#z6LSbgq3GejX88eiAYWmZ9EiddS3GaXodvm8MJJyEH7bqXgz',
          type: 'X25519KeyAgreementKey2019',
          controller: 'did:key:z6Mkfriq1MqLBoPWecGoDLjguo1sB9brj6wT3qZ5BxkKpuP6',
          publicKeyBase58: '1eskLvf2fvy5A912VimK3DZRRzgwKayUKbHjpU589vE',
        },
      ],
    })
  })

  it('should fail predictably when unsupported method is resolved', async () => {
    expect.assertions(1)
    await expect(resolverPlugin.resolveDid({ didUrl: 'did:unsupported:lorem.ipsum' })).resolves.toEqual({
      didDocument: null,
      didDocumentMetadata: {},
      didResolutionMetadata: { error: 'unsupportedDidMethod' },
    })
  })

  it.todo('should resolve ethr-did with custom web3 provider')
})
