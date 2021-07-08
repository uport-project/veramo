import { getAgent } from './setup'
import program from 'commander'
import { printTable } from 'console-table-printer'

const discover = program.command('discover').description('Discovery')

discover
  .command('did')
  .description('did discovery')
  .option('-q, --query <string>', 'Query string')

  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)

    const response = await agent.discoverDid({ query: cmd.query })
    const list: any = []

    response.results.forEach((r) => {
      r.matches.forEach((m) => {
        list.push({
          provider: r.provider,
          did: m.did,
        })
      })
    })

    if (list.length > 0) {
      printTable(list)
    } else {
      console.log('No dids discovered')
    }
  })
