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

  const namespacesToAdd = new Set()
  const nsGrantsToAdd = new Set()
  const directory = `charts/features/deployments/${featureName}`

  const files = await glob(`${directory}/**/values.yaml`)

  for (const file of files) {
    const textContent = readFileSync(file, 'utf8')
    const yamlContent = await jsyaml.load(textContent)
    const namespaceToAdd =
      yamlContent &&
      typeof yamlContent === 'object' &&
      'namespace' in yamlContent
        ? yamlContent?.namespace
        : null

    const nsGrantToAdd =
      yamlContent &&
      typeof yamlContent === 'object' &&
      'grantNamespaces' in yamlContent
        ? yamlContent?.grantNamespaces
        : null

    if (namespaceToAdd) {
      namespacesToAdd.add(namespaceToAdd)
    }

    if (nsGrantToAdd && Array.isArray(nsGrantToAdd)) {
      console.log(nsGrantToAdd)
      nsGrantToAdd.forEach((nsGrant) => nsGrantsToAdd.add(nsGrant))
    }
  }

  console.log('Namespaces to add:', namespacesToAdd)
  console.log('NS grants to add:', nsGrantsToAdd)

  const directoryPath = path.join(directory, 'bootstrap')
  mkdirSync(directoryPath, { recursive: true })

  const content = {
    namespaces: Array.from(namespacesToAdd),
    grantNamespacesEnabled: true,
    grantNamespaces: Array.from(nsGrantsToAdd),
  }
  writeFileSync(
    `${directoryPath}/values.bootstrap.yaml`,
    jsyaml.dump(content),
    { encoding: 'utf-8' },
  )
}
