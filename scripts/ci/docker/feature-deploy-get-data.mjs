// @ts-check
import { glob } from 'glob'
import jsyaml from 'js-yaml'
import core from '@actions/core'
import fs, { readFileSync } from 'node:fs'
import github from '@actions/github'
import { findNestedObjectByKey } from './utils.mjs'
import { isMainModule } from './utils.mjs'

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

function getCommitMsg(context) {
  if (context.eventName === 'pull_request') {
    let pr = context.payload.pull_request
    return `Change from: ${pr.html_url}`
  }
  return `Change from: https://github.com/island-is/island.is/commit/${context.sha}`
}

async function main(testContext = null) {
  const imageTag = process.env.DOCKER_TAG
  const featureName = process.env.FEATURE_NAME

  const context = testContext || github.context

  if (!imageTag || typeof imageTag !== 'string') {
    throw new Error(
      `Either \`DOCKER_TAG\` is not set or is of the wrong type, expected string type but got ${imageTag}.`,
    )
  }

  if (!featureName || typeof featureName !== 'string') {
    throw new Error(
      `Either \`FEATURE_NAME\` is not set or is of the wrong type, expected string type but got ${featureName}.`,
    )
  }

  const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT'
  core.setOutput(_KEY_HAS_OUTPUT, 'false')
  const _KEY_CHANGED_FILES = 'MQ_CHANGED_FILES'
  const _KEY_COMMIT_MSG = 'MQ_COMMIT_MSG'

  core.setOutput(_KEY_COMMIT_MSG, getCommitMsg(context))

  const _MANIFEST_PATHS = ['charts/features/deployments']

  const changedFiles = new Set()

  const globPattern = `${_MANIFEST_PATHS.join(',')}/**/*.yaml`

  const files = await glob(globPattern)

  for (const file of files) {
    const textContent = readFileSync(file, 'utf8')
    const yamlContent = await jsyaml.load(textContent)

    const content = findNestedObjectByKey(yamlContent, 'image')

    if (
      typeof content === 'object' &&
      typeof content.image === 'object' &&
      content.image.repository &&
      typeof content.image.repository === 'string'
    ) {
      content.image.tag = imageTag
      fs.writeFileSync(file, jsyaml.dump(yamlContent), { encoding: 'utf-8' })
      console.log(`Changed file ${file}`)
      changedFiles.add(file)
    } else if (file.includes('bootstrap-fd-job') && !changedFiles.has(file)) {
      console.log(`Adding bootstrap-fd-job file ${file}`)
      changedFiles.add(file)
    } else if (file.includes('cleanup-fd-job') && !changedFiles.has(file)) {
      console.log(`Adding cleanup-fd-job file ${file}`)
      changedFiles.add(file)
    } else if (!file.includes('values.bootstrap') && !changedFiles.has(file)) {
      console.log(`Skipping file ${file}`)
    }
  }

  if (changedFiles.size > 0) {
    const bootstrapChart = await glob(
      `${_MANIFEST_PATHS}/**/values.bootstrap.yaml`,
    )

    for (const file of bootstrapChart) {
      changedFiles.add(file)
    }

    let c = Array.from(changedFiles)

    console.log(`Changed files: ${c.join(', ')}`)
    core.setOutput(_KEY_HAS_OUTPUT, 'true')
    core.setOutput(_KEY_CHANGED_FILES, c.join(','))
  }
}
