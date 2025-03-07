// @ts-check
import fs, { readFileSync } from 'node:fs'
import jsyaml from 'js-yaml'
import core from '@actions/core'
import github from '@actions/github'
import { MAIN_BRANCHES, RELEASE_BRANCHES } from './const.mjs'
import { glob } from 'glob'

// Make the main function that can be exported and tested separately
export async function main(testContext = null) {
  const context = testContext || github.context
  const branch = getBranch(context)
  const typeOfDeployment = getTypeOfDeployment(branch)
  const sha = context.sha

  const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT'
  const _KEY_CHANGED_FILES = 'MQ_CHANGED_FILES'
  const changedFiles = []

  if (typeOfDeployment.dev) {
    await prepareManifests('dev')
  }

  if (typeOfDeployment.staging) {
    await prepareManifests('staging')
  }

  if (typeOfDeployment.prod) {
    await prepareManifests('prod')
  }

  const _BOOTSTRAP_CHARTS = 'charts/bootstrap'

  if (changedFiles.length > 0) {
    const bootstrapChart = await glob(`${_BOOTSTRAP_CHARTS}/**/values.*.yaml`)
    for (const file of bootstrapChart) {
      changedFiles.push(file)
    }
    console.log(`Changed files is ${changedFiles.join(',')}`)
    core.setOutput(_KEY_HAS_OUTPUT, 'true')
    core.setOutput(_KEY_CHANGED_FILES, changedFiles.join(','))
  } else {
    console.log('No files changed')
    core.setOutput(_KEY_HAS_OUTPUT, 'false')
  }

  async function prepareManifests(STAGE_NAME) {
    const IMAGE_OBJECT = {}

    // Read all manifest files
    const _MANIFEST_PATHS = [
      'charts/islandis-services',
      'chart/features',
      'charts/judicial-system-services',
      'charts/identity-server-services',
    ]
    const files = await glob(
      `{${_MANIFEST_PATHS.join(',')}}/**/values.${STAGE_NAME}.yaml`,
    )
    for (const file of files) {
      const textContent = readFileSync(file, 'utf8')
      const yamlContent = await jsyaml.load(textContent)
      if (
        yamlContent &&
        typeof yamlContent === 'object' &&
        'image' in yamlContent &&
        yamlContent.image &&
        typeof yamlContent.image === 'object' &&
        'repository' in yamlContent.image
      ) {
        const repository = yamlContent.image.repository
        const imageName =
          typeof repository == 'string' ? repository.split('/').pop() : ''
        IMAGE_OBJECT[imageName] ??= []
        IMAGE_OBJECT[imageName].push({
          filePath: file,
          content: yamlContent,
        })
      }
    }

    await parseData(IMAGE_OBJECT)
  }

  async function parseData(IMAGE_OBJECT) {
    const fileName = `/tmp/data.json`
    if (!fs.existsSync(fileName)) {
      process.exit(0)
    }

    const fileData = fs.readFileSync(fileName, 'utf-8')
    const parsedData = JSON.parse(fileData)
    for (const value of parsedData) {
      const { project, imageName, imageTag } = value
      console.log(`Changing value for imageName ${imageName}`)
      if (imageName in IMAGE_OBJECT) {
        IMAGE_OBJECT[imageName].forEach(({ filePath, content }) => {
          content.image.tag = imageTag
          const newFile = jsyaml.dump(content)
          console.log(newFile)
          fs.writeFileSync(filePath, newFile, { encoding: 'utf-8' })
          changedFiles.push(filePath)
          console.info(`Updated ${filePath}`)
        })
      } else {
        console.info(`Skipping ${imageName}…`)
      }
    }
  }
}

// Export these functions for testing
export function getBranch(context = github.context) {
  if (context.eventName === 'merge_group') {
    return context.payload.merge_group.base_ref.replace('refs/heads/', '')
  }
  throw new Error(`Unsupported event: ${context.eventName}`)
}

export function getTypeOfDeployment(branch) {
  if (MAIN_BRANCHES.includes(branch)) {
    return {
      dev: true,
      staging: false,
      prod: false,
    }
  }
  if (RELEASE_BRANCHES.includes(branch)) {
    return {
      dev: false,
      staging: true,
      prod: true,
    }
  }
  throw new Error(`Unsupported branch: ${branch}`)
}

// Run the main function if this is the main module
if (import.meta.url === import.meta.main) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
