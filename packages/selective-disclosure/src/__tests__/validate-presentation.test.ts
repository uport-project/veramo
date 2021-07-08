import { VerifiableCredential, VerifiablePresentation } from '@veramo/core'
import { ISelectiveDisclosureRequest } from '../types'
import { SelectiveDisclosure } from '../action-handler'

const actionHandler = new SelectiveDisclosure()

const context = {
  agent: {
    execute: jest.fn(),
    availableMethods: jest.fn(),
    getSchema: jest.fn(),
    emit: jest.fn(),
  },
}

describe('@veramo/selective-disclosure-helper', () => {
  it('should validate presentation for sdr', async () => {
    const sdr: ISelectiveDisclosureRequest = {
      issuer: 'did:example:123',
      replyUrl: 'https://example.com/didcomm',
      tag: 'session-123',
      claims: [
        {
          reason: 'We are required by law to collect this information',
          claimType: 'firstName',
          essential: true,
        },
        {
          reason: 'You can get %30 discount if you are a member of the club',
          credentialContext: 'https://www.w3.org/2018/credentials/v1',
          credentialType: 'ClubMembership',
          claimType: 'status',
          claimValue: 'member',
          issuers: [
            {
              did: 'did:ethr:567',
              url: 'https://join-the-club.partner1.com',
            },
            {
              did: 'did:ethr:659',
              url: 'https://ecosystem.io',
            },
          ],
        },
      ],
      credentials: ['JWT-public-profile...'],
    }

    const did1 = 'did:example:555'
    const did2 = 'did:ethr:659'

    const credential1: VerifiableCredential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      issuer: { id: did1 },
      issuanceDate: '2012-12-19T06:01:17.171Z',
      credentialSubject: {
        id: did1,
        firstName: 'Alice',
        lastName: 'Smith',
      },
      proof: {
        jwt: 'mock',
      },
    }

    const credential2: VerifiableCredential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'ClubMembership'],
      issuer: { id: did2 },
      issuanceDate: '2012-12-19T06:01:17.171Z',
      credentialSubject: {
        id: did1,
        status: 'member',
      },
      proof: {
        jwt: 'mock',
      },
    }

    const presentation: VerifiablePresentation = {
      holder: did1,
      verifier: [did1],
      type: ['VerifiablePresentation'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      verifiableCredential: [credential1, credential2],
      proof: {
        jwt: 'mock',
      },
    }

    const result = await actionHandler.validatePresentationAgainstSdr({ presentation, sdr }, context)

    expect(result.claims[0].credentials[0].verifiableCredential.credentialSubject['firstName']).toEqual(
      'Alice',
    )
    expect(result.valid).toEqual(true)
  })

  it('should invalidate presentation for sdr', async () => {
    const sdr: ISelectiveDisclosureRequest = {
      issuer: 'did:example:123',
      claims: [
        {
          reason: 'We are required by law to collect this information',
          claimType: 'firstName',
          essential: true,
        },
      ],
    }

    const did1 = 'did:example:555'

    const credential1: VerifiableCredential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      issuer: { id: did1 },
      issuanceDate: '2012-12-19T06:01:17.171Z',
      credentialSubject: {
        id: did1,
        lastName: 'Smith',
      },
      proof: {
        jwt: 'mock',
      },
    }

    const presentation: VerifiablePresentation = {
      holder: did1,
      verifier: [did1],
      type: ['VerifiablePresentation'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      verifiableCredential: [credential1],
      proof: {
        jwt: 'mock',
      },
    }
    const result = await actionHandler.validatePresentationAgainstSdr({ presentation, sdr }, context)

    expect(result.valid).toEqual(false)
  })
})
