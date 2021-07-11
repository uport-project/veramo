import { W3CCredential } from '@veramo/core'
import { getAgent } from './setup'
import program from 'commander'
import inquirer from 'inquirer'
import qrcode from 'qrcode-terminal'

const credential = program.command('credential').description('W3C Verifiable Credential')

credential
  .command('create', { isDefault: true })
  .description('Create W3C Verifiable Credential')
  .option('-s, --send', 'Send')
  .option('-q, --qrcode', 'Show qrcode')
  .action(async (cmd) => {
    const agent = getAgent(program.opts().config)
    const identifiers = await agent.didManagerFind()
    if (identifiers.length === 0) {
      console.error('No dids')
      process.exit()
    }
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'proofFormat',
        choices: [
          'jwt',
          'lds'
        ],
        message: 'Credential proofFormat',
      },
      {
        type: 'list',
        name: 'iss',
        choices: identifiers.map((item) => ({
          name: `${item.did} ${item.alias}`,
          value: item.did,
        })),
        message: 'Issuer DID',
      },
      {
        type: 'input',
        name: 'sub',
        message: 'Subject DID',
        default: identifiers[0].did,
      },
      {
        type: 'input',
        name: 'type',
        message: 'Credential Type',
        default: 'VerifiableCredential,Profile',
      },
      {
        type: 'input',
        name: 'claimType',
        message: 'Claim Type',
        default: 'name',
      },
      {
        type: 'input',
        name: 'claimValue',
        message: 'Claim Value',
        default: 'Alice',
      },
      {
        type: 'list',
        name: 'addStatus',
        message: 'Is the credential revocable?',
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
      },
    ])

    const credentialSubject: any = {}
    credentialSubject.id = answers.sub
    const type: string = answers.claimType
    credentialSubject[type] = answers.claimValue

    const credential: W3CCredential = {
      issuer: { id: answers.iss },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://veramo.io/contexts/profile/v1'
      ],
      type: answers.type.split(','),
      issuanceDate: new Date().toISOString(),
      credentialSubject,
    }

    if (answers.addStatus) {
      const statusAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'type',
          message: 'Credential status type',
          default: 'EthrStatusRegistry2019',
        },
        {
          type: 'input',
          name: 'id',
          message: 'Credential status ID',
          default: 'rinkeby:0x97fd27892cdcD035dAe1fe71235c636044B59348',
        },
      ])

      credential['credentialStatus'] = {
        type: statusAnswers.type,
        id: statusAnswers.id,
      }
    }

    const verifiableCredential = await agent.createVerifiableCredential({
      save: true,
      credential,
      proofFormat: answers.proofFormat,
    })

    if (cmd.send) {
      let body;
      let type;
      if (answers.proofFormat == 'jwt') {
        body = verifiableCredential.proof.jwt
        type = 'jwt'
      } else {
        body = verifiableCredential
        type = 'w3c.vc'
      }
      try {
        const message = await agent.sendMessageDIDCommAlpha1({
          save: true,
          data: {
            from: answers.iss,
            to: answers.sub,
            type,
            body,
          },
        })
        console.dir(message, { depth: 10 })
      } catch (e) {
        console.error(e)
      }
    }

    if (cmd.qrcode) {
      qrcode.generate(verifiableCredential.proof.jwt)
    } else {
      console.dir(verifiableCredential, { depth: 10 })
    }
  })
