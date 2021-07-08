import program from 'commander'
import inquirer from 'inquirer'

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

import './did'
import './credential'
import './presentation'
import './explore'
import './sdr'
import './message'
import './discover'
import './version'
import './execute'
import './server'
import './setup'
import './config'
import './dev'

if (!process.argv.slice(2).length) {
  program.outputHelp()
} else {
  program.parse(process.argv)
}
