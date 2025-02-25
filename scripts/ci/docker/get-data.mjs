// @ts-check
import fs, { readFileSync } from 'node:fs'
import jsyaml from 'js-yaml'
import { execSync } from 'node:child_process'
import core from '@actions/core'
import github from '@actions/github'
import { MAIN_BRANCHES } from './const.mjs';
import { glob } from 'glob'

const context = github.context
const branch = getBranch()
const typeOfDeployment = getTypeOfDeployment()
const sha = context.sha
const name = getArtifactname()
const url = `https://api.github.com/repos/island-is/island.is/actions/artifacts?name=${name}`

const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT'
const _KEY_CHANGED_FILES = 'MQ_CHANGED_FILES'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const STAGE_NAME = typeOfDeployment.dev
  ? 'dev'
  : typeOfDeployment.staging
  ? 'staging'
  : typeOfDeployment.prod
  ? 'prod'
  : 'dev'

// Read all manifest files
const _MANIFEST_PATHS = [
  'charts/islandis-services',
  'charts/judicial-system-services',
  'charts/identity-server-services',
]
const files = await glob(
  `{${_MANIFEST_PATHS.join(',')}}/**/values.${STAGE_NAME}.yaml`,
)
const changedFiles = []
const IMAGE_OBJECT = {}
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

await parseData()

async function parseData() {
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
  console.log(`Changed files is ${changedFiles.join(',')}`)
  core.setOutput(_KEY_HAS_OUTPUT, 'true')
  core.setOutput(_KEY_CHANGED_FILES, changedFiles.join(','))
}

function getBranch() {
  if (context.eventName === 'merge_group') {
    return context.payload.merge_group.base_ref.replace('refs/heads/', '')
  }
  throw new Error(`Unsupported event: ${context.eventName}`)
}

function getTypeOfDeployment() {
  if (MAIN_BRANCHES.includes(branch)) {
    return {
      dev: true,
      staging: false,
      prod: false,
    }
  }
  if (branch.startsWith('release')) {
    return {
      dev: false,
      staging: false,
      prod: true,
    }
  }
  return {
    dev: false,
    staging: false,
    prod: false,
  }
}

function getArtifactname() {
  if (typeOfDeployment.dev) {
    return `main-${sha}`
  }
  if (typeOfDeployment.prod) {
    return `release-${sha}`
  }

  throw new Error(`Unsupported`)
}
