import { Credential, createCredentialEntity } from '../entities/credential'
import { createPresentationEntity } from '../entities/presentation'
import { createConnection, Connection, In } from 'typeorm'
import { Identifier, Message, Claim } from '../index'
import { Entities } from '../index'
import { blake2bHex } from 'blakejs'
import fs from 'fs'

describe('veramo core', () => {
  let connection: Connection
  const databaseFile = './test-db.sqlite'

  beforeAll(
    async () =>
      (connection = await createConnection({
        type: 'sqlite',
        database: databaseFile,
        entities: Entities,
      })),
  )

  beforeEach(async () => {
    await connection.dropDatabase()
    await connection.synchronize()
  })

  afterAll(async () => {
    await connection.close()
    fs.unlinkSync(databaseFile)
  })

  it('Saves identifier to DB', async () => {
    const identifier = new Identifier()
    identifier.did = 'did:test:123'
    await identifier.save()

    const fromDb = await Identifier.findOne(identifier.did)
    expect(fromDb?.did).toEqual(identifier.did)
  })

  it('Saves credential with claims', async () => {
    const did1 = 'did:test:111'
    const did2 = 'did:test:222'

    const entity = createCredentialEntity({
      '@context': ['https://www.w3.org/2018/credentials/v1323', 'https://www.w3.org/2020/demo/4342323'],
      type: ['VerifiableCredential', 'PublicProfile'],
      issuer: { id: did1 },
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did2,
        name: 'Alice',
        profilePicture: 'https://example.com/a.png',
        address: {
          street: 'Some str.',
          house: 1,
        },
      },
      proof: {
        jwt: 'mockJWT',
      },
    })
    await entity.save()

    const credential = await Credential.findOne(entity.hash, {
      relations: ['issuer', 'subject', 'claims', 'claims.issuer', 'claims.subject'],
    })
    expect(credential?.issuer.did).toEqual(did1)
    expect(credential?.subject?.did).toEqual(did2)
    expect(credential?.claims.length).toEqual(3)
    expect(credential?.claims[0]?.issuer?.did).toEqual(did1)
    expect(credential?.claims[0]?.subject?.did).toEqual(did2)
  })

  it('Saves message with credentials', async () => {
    const did1 = 'did:test:111'
    const did2 = 'did:test:222'
    const did3 = 'did:test:333'

    const vc = createCredentialEntity({
      '@context': ['https://www.w3.org/2018/credentials/v1323', 'https://www.w3.org/2020/demo/4342323'],
      type: ['VerifiableCredential', 'PublicProfile'],
      issuer: { id: did1 },
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did2,
        name: 'Alice',
        profilePicture: 'https://example.com/a.png',
        address: {
          street: 'Some str.',
          house: 1,
        },
      },
      proof: {
        jwt: 'mockJWT',
      },
    })

    const vp = createPresentationEntity({
      '@context': ['https://www.w3.org/2018/credentials/v1323', 'https://www.w3.org/2020/demo/4342323'],
      type: ['VerifiablePresentation', 'PublicProfile'],
      holder: did1,
      verifier: [did2],
      issuanceDate: new Date().toISOString(),
      verifiableCredential: [vc.raw],
      proof: {
        jwt: 'mockJWT',
      },
    })

    const vp2 = createPresentationEntity({
      '@context': ['https://www.w3.org/2018/credentials/v1323', 'https://www.w3.org/2020/demo/4342323'],
      type: ['VerifiablePresentation', 'PublicProfile'],
      holder: did1,
      verifier: [did3],
      issuanceDate: new Date().toISOString(),
      verifiableCredential: [vc.raw],
      proof: {
        jwt: 'mockJWT',
      },
    })

    await vp2.save()

    const m = new Message()
    m.from = new Identifier()
    m.from.did = did1
    m.to = new Identifier()
    m.to.did = did2
    m.type = 'mock'
    m.raw = 'mock'
    m.createdAt = new Date()
    m.credentials = [vc]
    m.presentations = [vp]

    await m.save()

    const message = await Message.findOne(m.id, {
      relations: [
        'credentials',
        'credentials.issuer',
        'credentials.subject',
        'credentials.claims',
        'presentations',
        'presentations.credentials',
      ],
    })

    expect(message?.credentials.length).toEqual(1)
    expect(message?.credentials[0].claims.length).toEqual(3)
    expect(message?.presentations.length).toEqual(1)
    expect(message?.presentations[0].credentials.length).toEqual(1)

    const claims = await Claim.find({
      relations: ['credential', 'credential.issuer', 'credential.subject'],
      where: {
        issuer: In([did1]),
        subject: In([did2]),
        type: 'name',
      },
    })

    expect(claims[0].type).toEqual('name')
    expect(claims[0].value).toEqual('Alice')
  })

  it('Message can have externally set id', async () => {
    const customId = blake2bHex('hash123')

    const message = new Message()
    message.type = 'custom'
    message.id = customId

    await message.save()

    const fromDb = await Message.findOne(customId)

    expect(fromDb?.id).toEqual(customId)
    expect(fromDb?.type).toEqual('custom')
  })

  it('enforces unique alias/provider for an identifier', async () => {
    const identifier = new Identifier()
    identifier.did = 'did:test:123'
    identifier.alias = 'test'
    identifier.provider = 'testProvider'
    const id1Result = await identifier.save()

    const identifier2 = new Identifier()
    identifier2.did = 'did:test:456'
    identifier2.alias = 'test'
    identifier2.provider = 'testProvider'
    await expect(identifier2.save()).rejects.toThrowError()
  })
})
