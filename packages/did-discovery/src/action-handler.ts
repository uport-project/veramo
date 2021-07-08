import { IAgentContext, IAgentPlugin, IDIDManager } from '@veramo/core'

import {
  IDIDDiscovery,
  IDIDDiscoveryDiscoverDidArgs,
  IDIDDiscoveryProviderResult,
  IDIDDiscoveryDiscoverDidResult,
} from './types'
import { AbstractDidDiscoveryProvider } from './abstract-did-discovery-provider'
import { schema } from './'
import Debug from 'debug'
const debug = Debug('veramo:did-discovery')

/**
 * This class adds support for discovering DIDs.
 */
export class DIDDiscovery implements IAgentPlugin {
  readonly methods: IDIDDiscovery
  readonly schema = schema.IDIDDiscovery
  readonly providers: Array<AbstractDidDiscoveryProvider>

  constructor(options: { providers: Array<AbstractDidDiscoveryProvider> }) {
    this.providers = options.providers
    this.methods = {
      discoverDid: this.discoverDid.bind(this),
    }
  }

  /**
   * Queries data providers and returns DIDs with metadata
   *
   * @param args - The param object with the properties necessary to discover DID
   * @param context - *RESERVED* This is filled by the framework when the method is called.
   *
   */
  async discoverDid(
    args: IDIDDiscoveryDiscoverDidArgs,
    context: IAgentContext<any>,
  ): Promise<IDIDDiscoveryDiscoverDidResult> {
    const results: IDIDDiscoveryProviderResult[] = []
    const errors: Record<string, string> = {}

    for (const provider of this.providers) {
      try {
        const providerResult = await provider.discoverDid(args, context)
        if (providerResult.matches.length > 0) {
          results.push(providerResult)
        }
      } catch (e) {
        errors[provider.name] = e.message
        debug(`Error ${provider}: ${e.message}`)
      }
    }

    const result: IDIDDiscoveryDiscoverDidResult = {
      ...args,
      results,
    }

    if (errors) {
      result['errors'] = errors
    }

    return result
  }
}
