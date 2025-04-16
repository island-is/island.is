// @ts-check
import { glob } from 'glob'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import jsyaml from 'js-yaml'
import { isMainModule } from './utils.mjs'

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

async function main() {
  const args = process.argv.slice(2)
  const featureName = args.length > 0 ? args[0] : process.env.FEATURE_NAME

  if (!featureName || typeof featureName !== 'string') {
    throw new Error(
      `Feature name parameter is missing, either send it in as a script parameter or as env.FEATURE_NAME`,
    )
  }

  const namespacesToAdd = {}
  const directory = `charts/features/deployments/${featureName}`

  const files = await glob(`${directory}/**/values.yaml`)

  for (const file of files) {
    const applicationDirname = path.dirname(file)
    let applicationName = applicationDirname.split('/').slice(-1)[0]

    const textContent = readFileSync(file, 'utf8')
    const yamlContent = await jsyaml.load(textContent)
    const namespaceToAdd =
      yamlContent &&
      typeof yamlContent === 'object' &&
      'namespace' in yamlContent
        ? yamlContent?.namespace
        : null

    if (namespaceToAdd) {
      namespacesToAdd[applicationName] ??= []
      namespacesToAdd[applicationName] = Array.from(
        new Set([...namespacesToAdd[applicationName], namespaceToAdd]),
      )
    }
  }

  console.log('Namespaces to add:', namespacesToAdd)

  for (const key of Object.keys(namespacesToAdd)) {
    const directoryPath = path.join(directory, key)
    mkdirSync(directory, { recursive: true })
    const content = {
      namespaces: namespacesToAdd[key],
    }
    writeFileSync(
      `${directoryPath}/values.bootstrap.yaml`,
      jsyaml.dump(content),
      { encoding: 'utf-8' },
    )
  }
}
