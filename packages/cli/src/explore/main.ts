import blessed from 'blessed'
import { ConfiguredAgent } from '../setup'
import { styles } from './styles'

import { getManagedIdentifiersTable } from './managed-identifiers'
import { getMessagesTable } from './messages'
import { getCredentialsTable } from './credentials'
import { getPresentationsTable } from './presentations'

const defaultScreenTitle = 'Agent'

export const renderMainScreen = async (agent: ConfiguredAgent) => {
  // Create a screen object.
  const screen = blessed.screen({
    smartCSR: true,
  })

  screen.title = defaultScreenTitle

  const mainMenuItems = [
    { title: 'Managed identifiers', getComponent: getManagedIdentifiersTable },
    { title: 'Messages', getComponent: getMessagesTable },
    { title: 'Credentials', getComponent: getCredentialsTable },
    { title: 'Presentations', getComponent: getPresentationsTable },
  ]

  const menu = blessed.list({
    label: 'Agent',
    top: 'center',
    left: 'center',
    border: 'line',
    align: 'center',
    keys: true,
    width: 'shrink',
    height: '70%',
    vi: true,
    mouse: true,
    style: styles.list,
    items: mainMenuItems.map((i) => i.title),
  })

  menu.on('select', async function (data) {
    const i = menu.getItemIndex(data)
    const component = await mainMenuItems[i].getComponent(agent, screen)

    component.key(['escape'], function (ch, key) {
      component.destroy()
      screen.title = defaultScreenTitle
      screen.render()
    })

    screen.append(component)
    component.focus()
    screen.render()
  })

  screen.append(menu)
  menu.focus()

  screen.key(['q', 'C-c'], function (ch, key) {
    return process.exit(0)
  })
  screen.render()
}
