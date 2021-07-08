import { DIDResolutionResult, DIDResolver } from 'did-resolver'
import fetch from 'cross-fetch'

interface Options {
  url: string
}

/**
 * @deprecated please use `getUniresolver(url)` or `getUniresolverFor(methods, url)` instead
 */
export class UniversalResolver {
  constructor(options: Options) {
    return getUniversalResolver(options.url)
  }
}

/**
 * Creates a DIDResolver instance that can be used with `did-resolver`
 *
 * @example
 * ```typescript
 * const uniResolver = getUniversalResolver()
 * const resolver = new Resolver({
 *   web: uniResolver,
 *   key: uniResolver,
 *   elem: uniResolver
 * })
 * ```
 *
 * @param url the URL for the universal resolver instance (See https://uniresolver.io )
 * @returns `DIDResolver`
 */
export function getUniversalResolver(
  url: string = 'https://dev.uniresolver.io/1.0/identifiers/',
): DIDResolver {
  if (!url) {
    throw Error('[did-resolver] Universal: url required')
  }

  const resolve: DIDResolver = async (didUrl: string): Promise<DIDResolutionResult> => {
    try {
      const result = await fetch(url + didUrl)
      const ddo = await result.json()
      return ddo
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return resolve
}

/**
 * Creates a mapping of DID methods to a DIDResolver instance that can be used with `did-resolver`
 *
 * @example
 * ```typescript
 * const uniResolver = getUniversalResolverFor(['web', 'key', 'elem'])
 * const resolver = new Resolver({
 *   ...uniResolver,
 *   // other resolvers
 * })
 * ```
 *
 * @param methods an array of DID methods that should be resolved by this universal resolver
 * @param url the URL for the universal resolver instance (See https://uniresolver.io )
 * @returns `Record<string, DIDResolver>` a mapping of the given methods to an instance of `DIDResolver`
 */
export function getUniversalResolverFor(
  methods: string[],
  url: string = 'https://dev.uniresolver.io/1.0/identifiers/',
): Record<string, DIDResolver> {
  const uniResolver = getUniversalResolver(url)
  const mapping: Record<string, DIDResolver> = {}
  for (const method of methods) {
    mapping[method] = uniResolver
  }
  return mapping
}
