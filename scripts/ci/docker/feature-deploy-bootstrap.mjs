// @ts-check
import { glob } from 'glob'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import jsyaml from 'js-yaml'
import { findNestedObjectByKey } from './utils.mjs'

const bootstrap = {
  'charts/features': {
    dev: 'dev',
  },
}

const namespacesToAdd = {}

for (const [chart, deployment] of Object.entries(bootstrap)) {
  for (const [type, name] of Object.entries(deployment)) {
    const files = await glob(
      `${chart}/**/${process.env.FEATURE_NAME}.${type}.yaml`,
    )
    for (const file of files) {
      const textContent = readFileSync(file, 'utf8')
      const yamlContent = await jsyaml.load(textContent)
      for (const [_, val] of Object.entries(yamlContent)) {
        const content = findNestedObjectByKey(val, 'namespace')
        const namespaceToAdd =
          content && typeof content === 'object' && 'namespace' in content
            ? content?.namespace
            : null

        if (namespaceToAdd) {
          console.log('Found namespace')
          namespacesToAdd[name] ??= []
          namespacesToAdd[name] = Array.from(
            new Set([...namespacesToAdd[name], namespaceToAdd]),
          )
        }
      }
    }
  }
}

for (const key of Object.keys(namespacesToAdd)) {
  mkdirSync('charts/bootstrap', { recursive: true })
  const file = `charts/bootstrap/${process.env.FEATURE_NAME}.${key}.yaml`
  const content = {
    namespaces: namespacesToAdd[key],
  }
  writeFileSync(file, jsyaml.dump(content), { encoding: 'utf-8' })
}
