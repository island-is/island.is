// @ts-check
import { glob } from 'glob'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import jsyaml from 'js-yaml'

const bootstrap = {
  'charts/identity-server-services': {
    dev: 'ids-dev',
    prod: 'ids-prod',
    staging: 'staging',
  },
  'charts/islandis-services': {
    dev: 'dev',
    prod: 'prod',
    staging: 'staging',
  },
  'charts/judicial-system-services': {
    dev: 'dev',
    prod: 'prod',
    staging: 'staging',
  },
  'charts/features': {
    dev: 'dev',
  },
}

const namespacesToAdd = {}

for (const [chart, deployment] of Object.entries(bootstrap)) {
  for (const [type, name] of Object.entries(deployment)) {
    const files = await glob(`${chart}/**/values.${type}.yaml`)
    for (const file of files) {
      const textContent = readFileSync(file, 'utf8')
      const yamlContent = await jsyaml.load(textContent)
      const namespaceToAdd =
        yamlContent &&
        typeof yamlContent === 'object' &&
        'namespace' in yamlContent
          ? yamlContent?.namespace
          : null
      if (namespaceToAdd) {
        namespacesToAdd[name] ??= []
        namespacesToAdd[name] = Array.from(
          new Set([...namespacesToAdd[name], namespaceToAdd]),
        )
      }
    }
  }
}

for (const key of Object.keys(namespacesToAdd)) {
  mkdirSync('charts/bootstrap', { recursive: true })
  const file = `charts/bootstrap/values.${key}.yaml`
  const content = {
    namespaces: namespacesToAdd[key],
  }
  writeFileSync(file, jsyaml.dump(content), { encoding: 'utf-8' })
}
