import { resolve } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import * as TJS from 'ts-json-schema-generator'
import { existsSync, readdirSync, copyFileSync, mkdirSync, unlinkSync } from 'fs'
import { DocFencedCode } from '@microsoft/tsdoc'
import {
  ApiModel,
  ApiPackage,
  ApiParameterListMixin,
  ApiDocumentedItem,
  ApiReturnTypeMixin,
  ApiMethodSignature,
} from '@microsoft/api-extractor-model'

const outputFolder = './temp'
const inputFolders = [
  'packages/core/api/',
  'packages/credential-w3c/api/',
  'packages/selective-disclosure/api/',
  'packages/did-comm/api/',
  'packages/data-store/api/',
]

if (!existsSync(resolve(outputFolder))) {
  console.log('Creating', outputFolder)
  mkdirSync(resolve(outputFolder))
} else {
  console.log('Removing files in', outputFolder)
  readdirSync(resolve(outputFolder)).forEach((file) => {
    unlinkSync(resolve(outputFolder, file))
  })
}

for (const inputFolder of inputFolders) {
  readdirSync(resolve(inputFolder)).forEach((file) => {
    console.log('Copying', resolve(outputFolder, file))
    copyFileSync(resolve(inputFolder, file), resolve(outputFolder, file))
  })
}

const apiJsonFilePath = './temp/<unscopedPackageName>.api.json'

const agentPlugins: Record<string, Array<string>> = {
  core: ['IResolver', 'IDIDManager', 'IMessageHandler', 'IDataStore', 'IKeyManager'],
  'credential-w3c': ['ICredentialIssuer'],
  'selective-disclosure': ['ISelectiveDisclosure'],
  'did-comm': ['IDIDComm'],
  'data-store': ['IDataStoreORM'],
}

interface RestMethod {
  packageName: string
  pluginInterfaceName: string
  operationId: string
  description?: string
  example?: DocFencedCode
  parameters?: string
  response: string
}

let allMethods: Array<RestMethod> = []

for (const packageName of Object.keys(agentPlugins)) {
  const generator = TJS.createGenerator({
    path: resolve('packages/' + packageName + '/src/index.ts'),
    encodeRefs: false,
    // TODO: https://github.com/transmute-industries/vc.js/issues/60
    skipTypeCheck: true
  })

  const apiModel: ApiModel = new ApiModel()
  const apiPackage = apiModel.loadPackage(apiJsonFilePath.replace('<unscopedPackageName>', packageName))

  const entry = apiPackage.entryPoints[0]

  for (const pluginInterfaceName of agentPlugins[packageName]) {
    console.log(packageName, pluginInterfaceName)
    const pluginInterface = entry.findMembersByName(pluginInterfaceName)[0]

    // Collecting method information
    const methods: RestMethod[] = []
    for (const member of pluginInterface.members) {
      const method: Partial<RestMethod> = {}
      method.packageName = packageName
      method.pluginInterfaceName = pluginInterfaceName
      method.operationId = member.displayName
      // console.log(member)
      method.parameters = (member as ApiParameterListMixin).parameters[0]?.parameterTypeExcerpt?.text
      method.response = (member as ApiReturnTypeMixin).returnTypeExcerpt.text
        .replace('Promise<', '')
        .replace('>', '')

      const methodSignature = member as ApiMethodSignature
      method.description = methodSignature.tsdocComment?.summarySection
        ?.getChildNodes()[0]
        //@ts-ignore
        ?.getChildNodes()[0]?.text

      method.example = (methodSignature.tsdocComment?.customBlocks[0]?.content?.getChildNodes()[1] as unknown) as DocFencedCode

      method.description = method.description || ''

      methods.push(method as RestMethod)
    }

    allMethods = allMethods.concat(methods)
  }
}

let tests = ''
for (const method of allMethods) {
  if (method.example) {
    tests += `\nit('${method.packageName}-${method.pluginInterfaceName}-${method.operationId} example', async () => {\n${method.example.code}\n})\n`
  }
}
tests = `DO NOT EDIT MANUALLY START\n ${tests}\n//DO NOT EDIT MANUALLY END`

const testsFile = '__tests__/shared/documentationExamples.ts'
const source = readFileSync(testsFile).toString()
const newSource = source.replace(/DO NOT EDIT MANUALLY START(.+?)DO NOT EDIT MANUALLY END/s, tests)
writeFileSync(testsFile, newSource)
