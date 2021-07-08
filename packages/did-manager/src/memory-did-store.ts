import { IIdentifier } from '@veramo/core'
import { AbstractDIDStore } from './abstract-identifier-store'

export class MemoryDIDStore extends AbstractDIDStore {
  private identifiers: Record<string, IIdentifier> = {}

  async get({
    did,
    alias,
    provider,
  }: {
    did: string
    alias: string
    provider: string
  }): Promise<IIdentifier> {
    if (did !== undefined && alias === undefined) {
      if (!this.identifiers[did]) throw Error('Identifier not found')
      return this.identifiers[did]
    } else if (did === undefined && alias !== undefined && provider !== undefined) {
      for (const key of Object.keys(this.identifiers)) {
        if (this.identifiers[key].alias === alias && this.identifiers[key].provider === provider) {
          return this.identifiers[key]
        }
      }
    } else {
      throw Error('Get requires did or (alias and provider)')
    }
    throw Error('Identifier not found')
  }

  async delete({ did }: { did: string }) {
    delete this.identifiers[did]
    return true
  }

  async import(args: IIdentifier) {
    const identifier = { ...args }
    for (const key of identifier.keys) {
      if (key.privateKeyHex) {
        delete key.privateKeyHex
      }
    }
    this.identifiers[args.did] = identifier
    return true
  }

  async list(args: { alias?: string; provider?: string }): Promise<IIdentifier[]> {
    let result: IIdentifier[] = []

    for (const key of Object.keys(this.identifiers)) {
      result.push(this.identifiers[key])
    }

    if (args.alias && !args.provider) {
      result = result.filter((i) => i.alias === args.alias)
    } else if (args.provider && !args.alias) {
      result = result.filter((i) => i.provider === args.provider)
    } else if (args.provider && args.alias) {
      result = result.filter((i) => i.provider === args.provider && i.alias === args.alias)
    }

    return result
  }
}
