import 'cross-fetch/polyfill'
import yaml from 'yaml'
import { IDataStore, IDIDManager, IMessageHandler, IKeyManager, IResolver, TAgent } from '@veramo/core'
import { ICredentialIssuer } from '@veramo/credential-w3c'
import { ISelectiveDisclosure } from '@veramo/selective-disclosure'
import { IDIDComm } from '@veramo/did-comm'
import { IDataStoreORM } from '@veramo/data-store'
import { IDIDDiscovery } from '@veramo/did-discovery'

const fs = require('fs')
import { createAgentFromConfig } from './lib/agentCreator'

export const getConfig = (fileName: string): any => {
  if (!fs.existsSync(fileName)) {
    console.log('Config file not found: ' + fileName)
    console.log('Use "veramo config create" to create one')
    process.exit(1)
  }

  const config = yaml.parse(fs.readFileSync(fileName).toString())

  if (config?.version != 2) {
    console.log('Unsupported configuration file version:', config.version)
    process.exit(1)
  }
  return config
}

export type EnabledInterfaces = IDIDManager &
  IKeyManager &
  IDataStore &
  IDataStoreORM &
  IResolver &
  IMessageHandler &
  IDIDComm &
  ICredentialIssuer &
  ISelectiveDisclosure &
  IDIDDiscovery

export type ConfiguredAgent = TAgent<EnabledInterfaces>

export function getAgent(fileName: string) {
  try {
    return createAgentFromConfig<EnabledInterfaces>(getConfig(fileName))
  } catch (e) {
    console.log('Unable to create agent from ' + fileName + '.', e.message)
    process.exit(1)
  }
}
