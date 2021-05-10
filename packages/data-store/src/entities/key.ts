import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne } from 'typeorm'
import { Identifier } from './identifier'

export type KeyType = 'Ed25519' | 'Secp256k1'

@Entity('key')
export class Key extends BaseEntity {
  @PrimaryColumn()
  //@ts-ignore
  kid: string

  @Column()
  //@ts-ignore
  kms: string

  @Column()
  //@ts-ignore
  type: KeyType

  @Column()
  //@ts-ignore
  publicKeyHex: string

  @Column({ nullable: true })
  privateKeyHex?: string

  @Column({ type: 'simple-json', nullable: true })
  meta?: object | null

  @ManyToOne((type) => Identifier, (identifier) => identifier.keys)
  //@ts-ignore
  identifier: Identifier
}
