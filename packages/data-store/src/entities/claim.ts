import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Identifier } from './identifier'
import { Credential } from './credential'

@Entity('claim')
export class Claim extends BaseEntity {
  @PrimaryColumn()
  //@ts-ignore
  hash: string

  @ManyToOne((type) => Identifier, (identifier) => identifier.issuedClaims, {
    eager: true,
  })
  //@ts-ignore
  issuer: Identifier

  @ManyToOne((type) => Identifier, (identifier) => identifier.receivedClaims, {
    eager: true,
    nullable: true,
  })
  subject?: Identifier

  @ManyToOne((type) => Credential, (credential) => credential.claims)
  //@ts-ignore
  credential: Credential

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
  credentialType: string[]

  @Column()
  //@ts-ignore
  type: string

  @Column('text', { nullable: true })
  //@ts-ignore
  value: string | null

  @Column()
  //@ts-ignore
  isObj: boolean
}
