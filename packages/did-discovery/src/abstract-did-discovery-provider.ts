import { IAgentContext } from '@veramo/core'
import { IDIDDiscoveryDiscoverDidArgs, IDIDDiscoveryProviderResult } from './types'

/**
 * An abstract class for the {@link @veramo/did-discovery#DIDDiscovery} providers
 * @public
 */
export abstract class AbstractDidDiscoveryProvider {
  abstract name: string
  abstract discoverDid(
    args: IDIDDiscoveryDiscoverDidArgs,
    context: IAgentContext<any>,
  ): Promise<IDIDDiscoveryProviderResult>
}
