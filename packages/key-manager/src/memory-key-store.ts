import { IKey } from '@veramo/core'
import { AbstractKeyStore } from './abstract-key-store'

export class MemoryKeyStore extends AbstractKeyStore {
  private keys: Record<string, IKey> = {}

  async get({ kid }: { kid: string }): Promise<IKey> {
    const key = this.keys[kid]
    if (!key) throw Error('Key not found')
    return key
  }

  async delete({ kid }: { kid: string }) {
    delete this.keys[kid]
    return true
  }

  async import(args: IKey) {
    this.keys[args.kid] = { ...args }
    return true
  }
}
