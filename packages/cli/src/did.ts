import { IDIDManagerCreateArgs } from '@veramo/core'
import { getAgent } from './setup'
import inquirer from 'inquirer'
import program from 'commander'
import { printTable } from 'console-table-printer'

const did = program.command('did').description('Decentralized identifiers')

did
  .command('providers')
  .description('list available identifier providers')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    const providers = await agent.didManagerGetProviders()
    const list = providers.map((provider) => ({ provider }))

    if (list.length > 0) {
      printTable(list)
    } else {
      console.log('No identifier providers')
    }
  })

did
  .command('list', { isDefault: true })
  .description('list managed identifiers')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    const list = await agent.didManagerFind()

    if (list.length > 0) {
      const dids = list.map((item) => ({ provider: item.provider, alias: item.alias, did: item.did }))
      printTable(dids)
    } else {
      console.log('No dids')
    }
  })

did
  .command('create')
  .description('create an identifier')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const providers = await agent.didManagerGetProviders()
      const kms = await agent.keyManagerGetKeyManagementSystems()
      const args: IDIDManagerCreateArgs = {}

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'provider',
          choices: providers,
          message: 'Select identifier provider',
        },
        {
          type: 'list',
          name: 'kms',
          choices: kms,
          message: 'Select key management system',
        },
        {
          type: 'input',
          name: 'alias',
          message: 'Enter alias',
        },
      ])

      const identifier = await agent.didManagerCreate(answers)
      printTable([{ provider: identifier.provider, alias: identifier.alias, did: identifier.did }])
    } catch (e) {
      console.error(e.message)
    }
  })

did
  .command('delete')
  .description('create an identifier')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const identifiers = await agent.didManagerFind()
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'did',
          choices: identifiers.map((item) => item.did),
          message: 'Delete DID',
        },
      ])

      const result = await agent.didManagerDelete({
        did: answers.did,
      })

      console.log('Success:', result)
    } catch (e) {
      console.error(e)
    }
  })

did
  .command('add-service')
  .description('add a service endpoint to did document')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const identifiers = await agent.didManagerFind()
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'did',
          choices: identifiers.map((item) => item.did),
          message: 'Select DID',
        },
        {
          type: 'text',
          name: 'type',
          message: 'Service type',
          default: 'Messaging',
        },
        {
          type: 'text',
          name: 'endpoint',
          message: 'Endpoint',
        },
        {
          type: 'text',
          name: 'id',
          message: 'ID',
        },
      ])

      const result = await agent.didManagerAddService({
        did: answers.did,
        service: {
          type: answers.type,
          serviceEndpoint: answers.endpoint,
          id: answers.id,
        },
      })

      console.log('Success:', result)
    } catch (e) {
      console.error(e)
    }
  })

did
  .command('remove-service')
  .description('remove a service endpoint from did document')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const identifiers = await agent.didManagerFind()
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'did',
          choices: identifiers.map((item) => item.did),
          message: 'Select DID',
        },
        {
          type: 'text',
          name: 'id',
          message: 'ID',
        },
      ])

      const result = await agent.didManagerRemoveService({
        did: answers.did,
        id: answers.id,
      })

      console.log('Success:', result)
    } catch (e) {
      console.error(e)
    }
  })

did
  .command('add-key')
  .description('create and add a public key to did document')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const identifiers = await agent.didManagerFind()
      const kms = await agent.keyManagerGetKeyManagementSystems()
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'did',
          choices: identifiers.map((item) => item.did),
          message: 'Select DID',
        },
        {
          type: 'list',
          name: 'kms',
          choices: kms,
          message: 'Select key management system',
        },
        {
          type: 'list',
          name: 'type',
          choices: ['Ed25519', 'Secp256k1'],
          message: 'Type',
        },
      ])

      const key = await agent.keyManagerCreate({
        kms: answers.kms,
        type: answers.type,
      })

      const result = await agent.didManagerAddKey({
        did: answers.did,
        key,
      })

      console.log('Success:', result)
    } catch (e) {
      console.error(e)
    }
  })

did
  .command('remove-key')
  .description('remove a key from did document')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const identifiers = await agent.didManagerFind()
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'did',
          choices: identifiers.map((item) => item.did),
          message: 'Select DID',
        },
        {
          type: 'text',
          name: 'id',
          message: 'ID',
        },
      ])

      const result = await agent.didManagerRemoveKey({
        did: answers.did,
        kid: answers.id,
      })

      console.log('Success:', result)
    } catch (e) {
      console.error(e)
    }
  })

did
  .command('export')
  .description('export an identifier')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const identifiers = await agent.didManagerFind()
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'did',
          choices: identifiers.map((item) => ({
            name: item.did + ' ' + item.alias,
            value: item.did,
          })),
          message: 'Select DID',
        },
      ])

      const identifier = await agent.didManagerGet({ did: answers.did })

      console.log(JSON.stringify(identifier))
    } catch (e) {
      console.error(e)
    }
  })

did
  .command('import')
  .description('import an identifier')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    try {
      const answers = await inquirer.prompt([
        {
          type: 'text',
          name: 'identifier',
          message: 'Identifier (JSON object)',
        },
      ])

      const identifier = await agent.didManagerImport(JSON.parse(answers.identifier))
      console.log(identifier)
    } catch (e) {
      console.error(e)
    }
  })

did
  .command('resolve <didUrl>')
  .description('Resolve DID Document')
  .action(async (didUrl) => {
    const agent = getAgent(program.opts().config)
    try {
      const ddo = await agent.resolveDid({ didUrl })
      console.log(JSON.stringify(ddo, null, 2))
    } catch (e) {
      console.error(e.message)
    }
  })
