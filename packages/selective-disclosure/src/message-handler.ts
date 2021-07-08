import { IAgentContext, IMessageHandler } from '@veramo/core'
import { Message, AbstractMessageHandler } from '@veramo/message-handler'
import { blake2bHex } from 'blakejs'

import Debug from 'debug'
const debug = Debug('veramo:selective-disclosure:message-handler')

/**
 * Identifies a {@link @veramo/core#IMessage} that represents a Selective Disclosure Request
 *
 * @remarks See {@link https://github.com/uport-project/specs/blob/develop/messages/sharereq.md | Selective Disclosure Request}
 * @beta
 */
export const MessageTypes = {
  sdr: 'sdr',
}

/**
 * A Veramo message handler plugin that can decode an incoming Selective Disclosure Response
 * into the internal Message representation.
 *
 * @beta
 */
export class SdrMessageHandler extends AbstractMessageHandler {
  async handle(message: Message, context: IAgentContext<IMessageHandler>): Promise<Message> {
    const meta = message.getLastMetaData()

    if (message?.data?.type == MessageTypes.sdr && message?.data?.claims) {
      debug('Message type is', MessageTypes.sdr)

      message.id = blake2bHex(message.raw)
      message.type = MessageTypes.sdr
      message.from = message.data.iss

      if (message.data.replyTo) {
        message.replyTo = Array.isArray(message.data.replyTo)
          ? message.data.replyTo
          : message.data.replyTo
          ? [message.data.replyTo]
          : undefined
      }

      if (message.data.replyUrl) {
        message.replyUrl = message.data.replyUrl
      }

      if (message.data.subject) {
        message.to = message.data.subject
      }

      if (message.data.tag) {
        message.threadId = message.data.tag
      }
      message.createdAt = this.timestampToDate(message.data.nbf || message.data.iat).toISOString()

      if (
        message.data.credentials &&
        Array.isArray(message.data.credentials) &&
        message.data.credentials.length > 0
      ) {
        debug('Verifying included credentials')
        // FIXME
        // message.credentials = []
        // for (const raw of message.data.credentials) {
        //   try {
        //     const tmpMessage = await context.agent.handleMessage({ raw, save: false })
        //     if (tmpMessage.credentials) {
        //       message.credentials = [...message.credentials, ...tmpMessage.credentials]
        //     }
        //   } catch (e) {
        //     // Unsupported message type, or some other error
        //     debug(e)
        //   }
        // }
      }
      return message
    }

    return super.handle(message, context)
  }

  private timestampToDate(timestamp: number): Date {
    const date = new Date(0)
    date.setUTCSeconds(timestamp)
    return date
  }
}
