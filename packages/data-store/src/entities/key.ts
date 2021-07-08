import { KeyMetadata, TKeyType } from '@veramo/core'
import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne } from 'typeorm'
import { Identifier } from './identifier'

export type KeyType = TKeyType

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

  @Column({
    type: 'simple-json',
    nullable: true,
    transformer: {
      to: (value: any): KeyMetadata | null => {
        return value
      },
      from: (value: KeyMetadata | null): object | null => {
        return value
      },
    },
  })
  meta?: KeyMetadata | null

  @ManyToOne((type) => Identifier, (identifier) => identifier.keys)
  //@ts-ignore
  identifier: Identifier
}
