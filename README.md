[![Build, Test and Publish](https://github.com/uport-project/veramo/workflows/Build,%20Test%20and%20Publish/badge.svg?branch=next)](https://github.com/uport-project/veramo/actions?query=workflow%3A%22Build%2C+Test+and+Publish%22)
[![codecov](https://codecov.io/gh/uport-project/veramo/branch/next/graph/badge.svg)](https://codecov.io/gh/uport-project/veramo)

# Veramo
Veramo is a JavaScript Framework for Verifiable Data that was designed from the ground up to be flexible and modular which makes it highly scalable. Create an agent, add plugins, run on server or mobile. You can also control your agent over REST.

Veramo runs on Node, Browsers, and React Native straight out of the box. Save time by using the same API across all platforms.

## Documentation

See the full docs on [veramo.io](https://veramo.io)

- Agent
    - [Intro](https://veramo.io/docs/agent/introduction)
    - [Plugins](https://veramo.io/docs/agent/plugins)
    - [Plugins Directory](https://veramo.io/docs/agent/plugins_list)
- Guides
    - [CLI](https://veramo.io/docs/guides/cli)
    - [Node](https://veramo.io/docs/guides/nodejs)
    - [Create React App](https://veramo.io/docs/guides/browser)
    - [React Native](https://veramo.io/docs/guides/react_native)
    - [Custom Plugin](https://veramo.io/docs/guides/create_plugin)
    - [Cloud Agent](https://veramo.io/docs/guides/cloud_agent)
- Advanced
    - [Event System](https://veramo.io/docs/advanced/event_system)


## Local development

This monorepo uses [yarn](https://yarnpkg.com/) [workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and [lerna](https://lerna.js.org/)

Install root package dependencies

```
yarn install
```

Install all packages dependencies

```
yarn bootstrap
```

Build

```
yarn build
```

Run the tests

```
yarn test
```

```
yarn test:watch
```
