// @ts-check
import { glob } from 'glob'
import jsyaml from 'js-yaml'
import core from '@actions/core'
import fs, { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
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
  if (
    context.eventName === 'merge_group' ||
    context.eventName === 'pull_request'
  ) {
    console.log(context)
    return `Change from: island-is/island.is#${context.ref}`
    // const pr = context.ref.split('pr-')[1].split('-')[0]
    // return `Change from: island-is/island.is#${pr}`
  }
  return `Change from: island-is/island.is@${context.sha}`
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

  const STAGE_NAME = 'dev'
  const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT'
  core.setOutput(_KEY_HAS_OUTPUT, 'false')
  const _KEY_CHANGED_FILES = 'MQ_CHANGED_FILES'
  const _KEY_COMMIT_MSG = 'MQ_COMMIT_MSG'

  core.setOutput(_KEY_COMMIT_MSG, getCommitMsg(context))

  const _MANIFEST_PATHS = ['charts/features']

  const changedFiles = new Set()

  const globPattern = `${_MANIFEST_PATHS.join(
    ',',
  )}/**/values*.${STAGE_NAME}.yaml`

  const files = await glob(globPattern)

  for (const file of files) {
    const textContent = readFileSync(file, 'utf8')
    const yamlContent = await jsyaml.load(textContent)

    for (const val of Object.values(yamlContent)) {
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
      } else if (file.includes('job-manifest') && !changedFiles.has(file)) {
        console.log(`Adding job-manifest file ${file}`)
        changedFiles.add(file)
      } else if (!changedFiles.has(file)) {
        console.log(`Skipping file ${file}`)
      }
    }
  }

  if (changedFiles.size > 0) {
    const applicationSetPath = path.join(_MANIFEST_PATHS[0], 'application-sets')

    const applicationSetFile = path.join(
      applicationSetPath,
      `${featureName}-application-set.yaml`,
    )
    if (!fs.existsSync(applicationSetPath)) {
      fs.mkdirSync(applicationSetPath, { recursive: true })
    }

    writeFileSync(
      applicationSetFile,
      helmApplicationSetTemplate(featureName, STAGE_NAME),
    )

    let _changedFiles = Array.from(changedFiles.add(applicationSetFile))

    console.log(`Changed files: ${_changedFiles.join(', ')}`)
    core.setOutput(_KEY_HAS_OUTPUT, 'true')
    core.setOutput(_KEY_CHANGED_FILES, _changedFiles.join(','))
  }
}

// TODO:  (ingvar) Use this template to create a application-set and cronjob helm file
const helmApplicationSetTemplate = (featureName, stageName) => `
# ApplicationSet
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: island-is-dev-${featureName}-services
  namespace: argocd
spec:
  goTemplate: true
  goTemplateOptions: ["missingkey=error"]
  generators:
    - git:
        repoURL: https://github.com/island-is/helm-values.git
        revision: main
        directories:
          - path: helm-values/islandis-services/* # Match each service directory
          - path: helm-values/islandis-services/endorsement-system-scripts-update-metadata
            exclude: true
          - path: helm-values/islandis-services/external-contracts-tests
            exclude: true
          - path: helm-values/islandis-services/application-system-api-worker
            exclude: true
          - path: helm-values/islandis-services/services-sessions-cleanup
            exclude: true
          - path: helm-values/islandis-services/services-university-gateway-worker
            exclude: true
          - path: helm-values/islandis-services/user-notification-cleanup-worker
            exclude: true
          - path: helm-values/islandis-services/xroad-collector
            exclude: true
          - path: helm-values/islandis-services/github-actions-cache
            exclude: true
          - path: helm-values/islandis-services/unicorn-app
            exclude: true
  template:
    metadata:
      name: 'dev-{{.path.basename}}' # Service name and environment
      labels:
        env: 'dev'
        type: 'service'
    spec:
      project: dev
      source:
        repoURL: 'https://github.com/island-is/helm-values.git'
        targetRevision: main
        path: 'helm/libs/api-template' # Path to the service chart
        helm:
          releaseName: 'dev-{{.path.basename}}'
          valueFiles:
            - '../../../helm-values/features/{{.path.basename}}/values.dev.yaml'
      destination:
        server: https://8E8DD757F1B8F72D28E1271984302C4B.sk1.eu-west-1.eks.amazonaws.com
      syncPolicy:
        automated:
          selfHeal: true
          prune: false
---
# Cronjob
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: island-is-dev-${featureName}-cronjob
  namespace: argocd
spec:
  goTemplate: true
  goTemplateOptions: ["missingkey=error"]
  generators:
    - git:
        repoURL: https://github.com/island-is/helm-values.git
        revision: main
        directories:
          - path: helm-values/islandis-services/endorsement-system-scripts-update-metadata
          - path: helm-values/islandis-services/external-contracts-tests
          - path: helm-values/islandis-services/application-system-api-worker
          - path: helm-values/islandis-services/services-sessions-cleanup
          - path: helm-values/islandis-services/services-university-gateway-worker
          - path: helm-values/islandis-services/user-notification-cleanup-worker
          - path: helm-values/islandis-services/xroad-collector
  template:
    metadata:
      name: 'dev-{{.path.basename}}' # Service name and environment
      labels:
        env: 'dev'
        type: 'cronjob'
    spec:
      project: dev
      source:
        repoURL: 'https://github.com/island-is/helm-values.git'
        targetRevision: main
        path: 'helm/libs/cronjob-template' # Path to the service chart
        helm:
          releaseName: 'dev-{{.path.basename}}'
          valueFiles:
            - '../../../helm-values/features/{{.path.basename}}/values.job-manifest.${stageName}.yaml'
      destination:
        server: https://8E8DD757F1B8F72D28E1271984302C4B.sk1.eu-west-1.eks.amazonaws.com
      syncPolicy: 
        automated:
          selfHeal: true
          prune: false
`
