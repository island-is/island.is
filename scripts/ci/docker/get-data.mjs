// @ts-check
import fs, { readFileSync } from 'node:fs'
import jsyaml from 'js-yaml'
import core from '@actions/core'
import github from '@actions/github'
import { MAIN_BRANCHES, RELEASE_BRANCHES } from './const.mjs'
import { glob } from 'glob'
import { isMainModule } from './utils.mjs'

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

// Make the main function that can be exported and tested separately
export async function main(testContext = null) {
  const SHOULD_DEPLOY_JUDICIAL =
    process.env['SHOULD_DEPLOY_JUDICIAL'] === 'true'
  const context = testContext || github.context
  const branch = getBranch(context)
  const typeOfDeployment = getTypeOfDeployment(branch)

  const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT'
  const _KEY_CHANGED_FILES = 'MQ_CHANGED_FILES'
  const _KEY_JUDICIAL_DEV = 'MQ_JUDICIAL_DEV'
  const _KEY_COMMIT_MSG = 'MQ_COMMIT_MSG'
  const changedFiles = []
  const judicialDev = []
  const judicialProd = []
  const _KEY_JUDICIAL_PROD = 'MQ_JUDICIAL_PROD'

  core.setOutput(_KEY_COMMIT_MSG, getCommitMsg(context))

  if (!SHOULD_DEPLOY_JUDICIAL) {
    if (typeOfDeployment.dev) {
      await prepareManifests('dev')
    }

    if (typeOfDeployment.staging) {
      await prepareManifests('staging')
    }

    if (typeOfDeployment.prod) {
      await prepareManifests('prod')
    }
  }

  if (SHOULD_DEPLOY_JUDICIAL) {
    await prepareManifests('dev')
    await prepareManifests('staging')
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
    if (SHOULD_DEPLOY_JUDICIAL) {
      core.setOutput(_KEY_JUDICIAL_DEV, judicialDev.join(','))
      core.setOutput(_KEY_JUDICIAL_PROD, judicialProd.join(','))
    }
  } else {
    console.log('No files changed')
    core.setOutput(_KEY_HAS_OUTPUT, 'false')
  }

  async function prepareManifests(STAGE_NAME) {
    const IMAGE_OBJECT = {}

    // Read all manifest files
    const _MANIFEST_PATHS = !SHOULD_DEPLOY_JUDICIAL
      ? ['charts/islandis-services', 'charts/identity-server-services']
      : ['charts/judicial-system-services']
    const manifestPath =
      _MANIFEST_PATHS.length > 1
        ? `{${_MANIFEST_PATHS.join(',')}}`
        : _MANIFEST_PATHS[0]
    const files = await glob(`${manifestPath}/**/values.${STAGE_NAME}.yaml`)
    console.log(files)

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
          if (SHOULD_DEPLOY_JUDICIAL) {
            if (filePath.endsWith('.dev.yaml')) {
              judicialDev.push(filePath)
            } else {
              judicialProd.push(filePath)
            }
          }
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
  if (context.eventName === 'workflow_dispatch') {
    return context.ref.replace('refs/heads/', '')
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

function getCommitMsg(context) {
  if (context.eventName === 'merge_group') {
    const pr = context.ref.split('pr-')[1].split('-')[0]
    return `Change from: island-is/island.is#${pr}`
  }
  return `Change from: https://github.com/island-is/island.is/commit/${context.sha}`
}
