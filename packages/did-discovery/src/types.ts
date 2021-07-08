import { IAgentContext, IPluginMethodMap } from '@veramo/core'

/**
 * Contains the parameters of a DID Discovery Request
 */
export interface IDIDDiscoveryDiscoverDidArgs {
  /**
   * Search string
   */
  query: string

  /**
   * Provider specific options
   */
  options?: Record<string, any>
}

/**
 * A single discovery match
 */
export interface IDIDDiscoverMatch {
  /**
   * DID
   */
  did: string

  /**
   * Provider specific related metadata about the match
   */
  metaData: Record<string, any>
}

/**
 * Discovery results from one provider
 */
export interface IDIDDiscoveryProviderResult {
  /**
   * Provider name
   */
  provider: string

  /**
   * List of discovery matches
   */
  matches: IDIDDiscoverMatch[]
}

/**
 * DID Discovery results
 */
export interface IDIDDiscoveryDiscoverDidResult extends Partial<IDIDDiscoveryDiscoverDidArgs> {
  /**
   * List of discovery results from different providers
   */
  results: IDIDDiscoveryProviderResult[]

  /**
   * A record of encountered errors
   */
  errors?: Record<string, string>
}

/**
 * Describes the interface of DID discovery plugin
 */
export interface IDIDDiscovery extends IPluginMethodMap {
  discoverDid(
    args: IDIDDiscoveryDiscoverDidArgs,
    context: IAgentContext<any>,
  ): Promise<IDIDDiscoveryDiscoverDidResult>
}
