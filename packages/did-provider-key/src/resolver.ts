import { resolver } from '@transmute/did-key.js'
import { DIDResolutionOptions, DIDResolutionResult, DIDResolver, ParsedDID, Resolvable } from 'did-resolver'

const resolve: DIDResolver = async (
  didUrl: string,
  _parsed: ParsedDID,
  _resolver: Resolvable,
  options: DIDResolutionOptions,
): Promise<DIDResolutionResult> => {
  try {
    const didResolution = (await resolver.resolve(didUrl, options)) as DIDResolutionResult
    return didResolution
  } catch (err) {
    return {
      didDocumentMetadata: {},
      didResolutionMetadata: { error: 'invalidDid', message: err.toString() },
      didDocument: null,
    }
  }
}

export function getDidKeyResolver() {
  return { key: resolve }
}
