import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne } from 'typeorm'
import { Identifier } from './identifier'

@Entity('service')
export class Service extends BaseEntity {
  @PrimaryColumn()
  //@ts-ignore
  id: string

  @Column()
  //@ts-ignore
  type: string

  @Column()
  //@ts-ignore
  serviceEndpoint: string

  @Column({ nullable: true })
  description?: string

  @ManyToOne((type) => Identifier, (identifier) => identifier.services)
  //@ts-ignore
  identifier: Identifier
}
