import { DIDDocumentSection, IAgentPlugin, IResolver, schema } from '@veramo/core'
import {
  Resolver,
  DIDDocument,
  DIDResolutionResult,
  DIDResolutionOptions,
  VerificationMethod,
  ServiceEndpoint,
  parse as parseDID,
} from 'did-resolver'
export { DIDDocument }
import Debug from 'debug'
const debug = Debug('veramo:resolver')

interface Options {
  resolver: Resolver
}

export class DIDResolverPlugin implements IAgentPlugin {
  readonly methods: IResolver
  readonly schema = schema.IResolver
  private didResolver: Resolver

  constructor(options: Options) {
    if (!options.resolver) throw Error('Missing resolver')
    this.didResolver = options.resolver

    this.methods = {
      resolveDid: this.resolveDid.bind(this),
      getDIDComponentById: this.getDIDComponentById.bind(this),
    }
  }

  /** {@inheritDoc @veramo/core#IResolver.resolveDid} */
  async resolveDid({
    didUrl,
    options,
  }: {
    didUrl: string
    options?: DIDResolutionOptions
  }): Promise<DIDResolutionResult> {
    debug('Resolving %s', didUrl)
    return this.didResolver.resolve(didUrl, options)
  }

  /** {@inheritDoc @veramo/core#IResolver.getDIDComponentById} */
  async getDIDComponentById({
    didDocument,
    didUrl,
    section,
  }: {
    didDocument: DIDDocument
    didUrl: string
    section?: DIDDocumentSection
  }): Promise<VerificationMethod | ServiceEndpoint> {
    debug('Resolving %s', didUrl)
    const did = parseDID(didUrl)?.did || didDocument.id
    const doc = didDocument
    const mainSections = [...(doc.verificationMethod || []), ...(doc.publicKey || []), ...(doc.service || [])]
    const subsection = section ? [...(doc[section] || [])] : mainSections

    let result = subsection.find((item) => {
      if (typeof item === 'string') {
        return item === didUrl || `${did}${item}` === didUrl
      } else {
        return item.id === didUrl || `${did}${item.id}` === didUrl
      }
    })
    if (typeof result === 'string') {
      result = mainSections.find((item) => item.id === didUrl || `${did}${item.id}` === didUrl)
    }

    if (!result) {
      const err = `not_found: DID document fragment (${didUrl}) could not be located.`
      debug(err)
      throw new Error(err)
    } else if (result.id.startsWith('#')) {
      // fix did documents that use only the fragment part as key ID
      result.id = `${did}${result.id}`
    }
    return result
  }
}
