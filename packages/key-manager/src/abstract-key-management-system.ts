import { IKey, TKeyType } from '@veramo/core'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { serialize, Transaction } from '@ethersproject/transactions'
import * as u8a from 'uint8arrays'

export abstract class AbstractKeyManagementSystem {
  abstract createKey(args: { type: TKeyType; meta?: any }): Promise<Omit<IKey, 'kms'>>
  abstract deleteKey(args: { kid: string }): Promise<boolean>

  /**@deprecated please use `sign({key, alg: 'eth_signTransaction', data: arrayify(serialize(transaction))})` instead */
  async signEthTX({ key, transaction }: { key: IKey; transaction: object }): Promise<string> {
    const { v, r, s, type, ...tx } = <Transaction>transaction
    const data = arrayify(serialize(tx))
    const algorithm = 'eth_signTransaction'
    const signedTxHexString = this.sign({ key, data, algorithm })
    return signedTxHexString
  }

  /**@deprecated please use `sign({key, data})` instead, with `Uint8Array` data */
  async signJWT({ key, data }: { key: IKey; data: string | Uint8Array }): Promise<string> {
    let dataBytes: Uint8Array
    if (typeof data === 'string') {
      try {
        dataBytes = arrayify(data, { allowMissingPrefix: true })
      } catch (e) {
        dataBytes = u8a.fromString(data, 'utf-8')
      }
    } else {
      dataBytes = data
    }
    return this.sign({ key, data: dataBytes })
  }

  abstract sign(args: { key: IKey; algorithm?: string; data: Uint8Array; [x: string]: any }): Promise<string>

  abstract sharedSecret(args: { myKey: IKey; theirKey: Pick<IKey, 'publicKeyHex' | 'type'> }): Promise<string>
}
