
import * as ION from '@decentralized-identity/ion-tools'

export function IonDidResolver() {

  return async function(did: string) {
    const didDoc = await ION.resolve(did)
    return didDoc
  }
}
