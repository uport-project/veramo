import { VerifiableCredential } from '@veramo/core'
import { blake2bHex } from 'blakejs'
import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn, OneToMany, ManyToMany } from 'typeorm'
import { Identifier } from './identifier'
import { Message } from './message'
import { Presentation } from './presentation'
import { Claim } from './claim'

@Entity('credential')
export class Credential extends BaseEntity {
  @PrimaryColumn()
  //@ts-ignore
  hash: string

  //@ts-ignore
  private _raw: VerifiableCredential

  set raw(raw: VerifiableCredential) {
    this._raw = raw
    this.hash = blake2bHex(JSON.stringify(raw))
  }

  @Column('simple-json')
  get raw(): VerifiableCredential {
    return this._raw
  }

  @ManyToOne((type) => Identifier, (identifier) => identifier.issuedCredentials, {
    cascade: ['insert'],
    eager: true,
  })
  //@ts-ignore
  issuer: Identifier

  // Subject can be null https://w3c.github.io/vc-data-model/#credential-uniquely-identifies-a-subject
  @ManyToOne((type) => Identifier, (identifier) => identifier.receivedCredentials, {
    cascade: ['insert'],
    eager: true,
    nullable: true,
  })
  subject?: Identifier

  @Column({ nullable: true })
  id?: string

  @Column()
  //@ts-ignore
  issuanceDate: Date

  @Column({ nullable: true })
  expirationDate?: Date

  @Column('simple-array')
  //@ts-ignore
  context: string[]

  @Column('simple-array')
  //@ts-ignore
  type: string[]

  @OneToMany((type) => Claim, (claim) => claim.credential, {
    cascade: ['insert'],
  })
  //@ts-ignore
  claims: Claim[]

  @ManyToMany((type) => Presentation, (presentation) => presentation.credentials)
  //@ts-ignore
  presentations: Presentation[]

  @ManyToMany((type) => Message, (message) => message.credentials)
  //@ts-ignore
  messages: Message[]
}

export const createCredentialEntity = (vc: VerifiableCredential): Credential => {
  const credential = new Credential()
  credential.context = vc['@context']
  credential.type = vc.type
  credential.id = vc.id

  if (vc.issuanceDate) {
    credential.issuanceDate = new Date(vc.issuanceDate)
  }

  if (vc.expirationDate) {
    credential.expirationDate = new Date(vc.expirationDate)
  }

  const issuer = new Identifier()
  issuer.did = vc.issuer.id
  credential.issuer = issuer

  if (vc.credentialSubject.id) {
    const subject = new Identifier()
    subject.did = vc.credentialSubject.id
    credential.subject = subject
  }
  credential.claims = []
  for (const type in vc.credentialSubject) {
    if (vc.credentialSubject.hasOwnProperty(type)) {
      const value = vc.credentialSubject[type]

      if (type !== 'id') {
        const isObj = typeof value === 'function' || (typeof value === 'object' && !!value)
        const claim = new Claim()
        claim.hash = blake2bHex(JSON.stringify(vc) + type)
        claim.type = type
        claim.value = isObj ? JSON.stringify(value) : value
        claim.isObj = isObj
        claim.issuer = credential.issuer
        claim.subject = credential.subject
        claim.expirationDate = credential.expirationDate
        claim.issuanceDate = credential.issuanceDate
        claim.credentialType = credential.type
        claim.context = credential.context
        credential.claims.push(claim)
      }
    }
  }

  credential.raw = vc
  return credential
}
