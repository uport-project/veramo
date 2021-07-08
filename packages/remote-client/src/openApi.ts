import { OpenAPIV3 } from 'openapi-types'
import { IAgent } from '@veramo/core'

export const getOpenApiSchema = (
  agent: IAgent,
  basePath: string,
  exposedMethods: Array<string>,
  name?: string,
  version?: string,
): OpenAPIV3.Document => {
  const agentSchema = agent.getSchema()

  const paths: OpenAPIV3.PathsObject = {}

  const schemas = {}
  const xMethods: Record<string, any> = {}

  for (const method of exposedMethods) {
    const pathItemObject: OpenAPIV3.PathItemObject = {
      post: {
        operationId: method,
        description: agentSchema.components.methods[method].description,
        requestBody: {
          content: {
            'application/json': {
              schema: agentSchema.components.methods[method].arguments,
            },
          },
        },
        responses: {
          200: {
            // TODO returnType description
            description: agentSchema.components.methods[method].description,
            content: {
              'application/json; charset=utf-8': {
                schema: agentSchema.components.methods[method].returnType,
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json; charset=utf-8': {
                schema: agentSchema.components.schemas.ValidationError,
              },
            },
          },
        },
      },
    }
    paths[basePath + '/' + method] = pathItemObject
    xMethods[method] = agentSchema.components.methods[method]
  }

  const openApi: OpenAPIV3.Document & { 'x-methods'?: Record<string, any> } = {
    openapi: '3.0.0',
    info: {
      title: name || 'DID Agent',
      version: version || '',
    },
    components: {
      schemas: agent.getSchema().components.schemas,
    },
    paths,
  }

  openApi['x-methods'] = xMethods

  return openApi
}
