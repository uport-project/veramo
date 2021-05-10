import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  PrimaryColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm'
import { blake2bHex } from 'blakejs'
import { IMessage } from '@veramo/core'
import { Identifier } from './identifier'
import { Presentation, createPresentationEntity } from './presentation'
import { Credential, createCredentialEntity } from './credential'

export interface MetaData {
  type: string
  value?: string
}

@Entity('message')
export class Message extends BaseEntity {
  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = blake2bHex(this.raw)
    }
  }

  @PrimaryColumn()
  //@ts-ignore
  id: string

  @CreateDateColumn({ select: false })
  //@ts-ignore
  saveDate: Date

  @UpdateDateColumn({ select: false })
  //@ts-ignore
  updateDate: Date

  @Column({ nullable: true })
  createdAt?: Date

  @Column({ nullable: true })
  expiresAt?: Date

  @Column({ nullable: true })
  threadId?: string

  @Column()
  //@ts-ignore
  type: string

  @Column({ nullable: true })
  raw?: string

  @Column('simple-json', { nullable: true })
  data?: object | null

  // https://github.com/decentralized-identifier/didcomm-messaging/blob/41f35f992275dd71d459504d14eb8d70b4185533/jwm.md#jwm-profile

  @Column('simple-array', { nullable: true })
  replyTo?: string[]

  @Column({ nullable: true })
  replyUrl?: string

  @ManyToOne((type) => Identifier, (identifier) => identifier.sentMessages, {
    nullable: true,
    cascade: ['insert'],
    eager: true,
  })
  from?: Identifier

  @ManyToOne((type) => Identifier, (identifier) => identifier.receivedMessages, {
    nullable: true,
    cascade: ['insert'],
    eager: true,
  })
  to?: Identifier

  @Column('simple-json', { nullable: true })
  metaData?: MetaData[] | null

  @ManyToMany((type) => Presentation, (presentation) => presentation.messages, {
    cascade: true,
  })
  @JoinTable()
  //@ts-ignore
  presentations: Presentation[]

  @ManyToMany((type) => Credential, (credential) => credential.messages, { cascade: true })
  @JoinTable()
  //@ts-ignore
  credentials: Credential[]
}

export const createMessageEntity = (args: IMessage): Message => {
  const message = new Message()
  message.id = args.id
  message.threadId = args.threadId
  message.type = args.type
  message.raw = args.raw
  message.data = args.data
  message.metaData = args.metaData

  if (args.replyTo) {
    message.replyTo = args.replyTo
  }
  if (args.replyUrl) {
    message.replyUrl = args.replyUrl
  }

  if (args.createdAt) {
    message.createdAt = new Date(args.createdAt)
  }

  if (args.expiresAt) {
    message.createdAt = new Date(args.expiresAt)
  }

  if (args.from) {
    const from = new Identifier()
    from.did = args.from
    message.from = from
  }

  if (args.to) {
    const to = new Identifier()
    to.did = args.to
    message.to = to
  }

  if (args.presentations) {
    message.presentations = args.presentations.map(createPresentationEntity)
  }

  if (args.credentials) {
    message.credentials = args.credentials.map(createCredentialEntity)
  }

  return message
}

export const createMessage = (args: Message): IMessage => {
  const message: Partial<IMessage> = {
    id: args.id,
    type: args.type,
    raw: args.raw,
    data: args.data,
    metaData: args.metaData,
  }

  if (args.threadId) {
    message.threadId = args.threadId
  }

  if (args.replyTo) {
    message.replyTo = args.replyTo
  }

  if (args.replyTo) {
    message.replyUrl = args.replyUrl
  }

  if (args.createdAt) {
    message.createdAt = args.createdAt.toISOString()
  }

  if (args.expiresAt) {
    message.expiresAt = args.expiresAt.toISOString()
  }

  if (args.from) {
    message.from = args.from.did
  }

  if (args.to) {
    message.to = args.to.did
  }

  if (args.presentations) {
    message.presentations = args.presentations.map((vp) => vp.raw)
  }

  if (args.credentials) {
    message.credentials = args.credentials.map((vc) => vc.raw)
  }

  return message as IMessage
}
