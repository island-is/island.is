// @ts-check
import { glob } from 'glob'
import jsyaml from 'js-yaml'
import core from '@actions/core'
import fs, { readFileSync } from 'node:fs'
import { findNestedObjectByKey } from './utils.mjs'

const imageTag = process.env.DOCKER_TAG

if (!imageTag || typeof imageTag !== 'string') {
  throw new Error(
    `Either \`DOCKER_TAG\` is not set or is of the wrong type, expected string type but got ${imageTag}.`,
  )
}

const STAGE_NAME = 'dev'
const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT'
core.setOutput(_KEY_HAS_OUTPUT, 'false')
const _KEY_CHANGED_FILES = 'MQ_CHANGED_FILES'

const _MANIFEST_PATHS = ['charts/features']

const changedFiles = new Set()

console.log(`Feature name ${process.env.FEATURE_NAME}`)

const globPattern = `${_MANIFEST_PATHS.join(',')}/**/${
  process.env.FEATURE_NAME
}*.${STAGE_NAME}.yaml`

const files = await glob(globPattern)

for (const file of files) {
  const textContent = readFileSync(file, 'utf8')
  const yamlContent = await jsyaml.load(textContent)

  for (const [_, val] of Object.entries(yamlContent)) {
    const content = findNestedObjectByKey(val, 'image')

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
    } else {
      console.log(`Skipping file ${file}`)
    }
  }
}

if (changedFiles.size > 0) {
  const _BOOTSTRAP_CHARTS = 'charts/bootstrap'

  const bootstrapChart = await glob(
    `${_BOOTSTRAP_CHARTS}/**/${process.env.FEATURE_NAME}.${STAGE_NAME}.yaml`,
  )
  for (const file of bootstrapChart) {
    changedFiles.add(file)
  }

  let _changedFiles = Array.from(changedFiles)

  console.log(`Changed files: ${_changedFiles.join(', ')}`)
  core.setOutput(_KEY_HAS_OUTPUT, 'true')
  core.setOutput(_KEY_CHANGED_FILES, _changedFiles.join(','))
}
