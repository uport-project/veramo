import { IAgentContext, IDIDManager } from '@veramo/core'
import {
  AbstractDidDiscoveryProvider,
  IDIDDiscoverMatch,
  IDIDDiscoveryProviderResult,
  IDIDDiscoveryDiscoverDidArgs,
} from '@veramo/did-discovery'

export class AliasDiscoveryProvider implements AbstractDidDiscoveryProvider {
  readonly name = 'alias'

  async discoverDid(
    args: IDIDDiscoveryDiscoverDidArgs,
    context: IAgentContext<IDIDManager>,
  ): Promise<IDIDDiscoveryProviderResult> {
    const matches = []
    try {
      const identifier = await context.agent.didManagerGetByAlias({ alias: args.query })
      const match: IDIDDiscoverMatch = {
        did: identifier.did,
        metaData: {
          alias: identifier.alias,
        },
      }
      matches.push(match)
    } catch (e) {}

    return {
      provider: this.name,
      matches,
    }
  }
}
