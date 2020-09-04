import { agent } from './setup'
import program from 'commander'

program
  .command('resolve <didUrl>')
  .description('Resolve DID Document')
  .action(async (didUrl) => {
    try {
      const ddo = await (await agent).resolveDid({ didUrl })
      console.log(ddo)
    } catch (e) {
      console.error(e)
    }
  })