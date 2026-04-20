#!/usr/bin/env ts-node
import yargs from 'yargs'
import { Charts, Deployments } from '../infra/src/uber-charts/all-charts'
import { execSync } from 'child_process'
import { branchNameToFeatureName } from './_common'
import { prepareServicesForEnv } from '../infra/src/dsl/processing/rendering-pipeline'
import { Envs } from '../infra/src/environments'
import { renderers } from '../infra/src/dsl/upstream-dependencies'

const argv = yargs(process.argv.slice(2))
  .options({
    'feature-branch-name': {
      type: 'string',
      demandOption: false,
    },
    'service-name': {
      type: 'string',
      demandOption: true,
    },
    cluster: {
      choices: [
        'dev-cluster02',
        'staging-cluster02',
        'prod-cluster02',
        'ids-prod-cluster02',
      ],
      demandOption: true,
      description: 'Cluster ID',
      default: 'dev-cluster02',
    },
    chart: {
      choices: ['islandis', 'judicial-system'],
      demandOption: true,
      description: 'Name of the umbrella chart to use',
      default: 'islandis',
    },
  })
  .showHelpOnFail(true)
  .epilogue(`Restart service in Kubernetes cluster`)

void (async function () {
  const serviceName = argv.argv['service-name']
  const chart = argv.argv.chart as keyof typeof Charts

  const habitat = Charts[chart].dev
  const target = habitat.filter(
    (service) => service.serviceDef.name === serviceName,
  )
  if (target.length != 1) {
    throw Error(`Service with name ${serviceName} not found in chart ${chart}`)
  }

  const featureBranchName = argv.argv['feature-branch-name']
  const out = prepareServicesForEnv({
    env: {
      ...Envs[Deployments[chart]['dev']],
      feature: typeof featureBranchName
        ? branchNameToFeatureName(featureBranchName)
        : undefined,
    },
    outputFormat: renderers.helm,
    services: target[0],
  })
  const targetService = out[0]
  execSync(
    `${__dirname}/_run-aws-eks-commands.js restart-service --namespace ${targetService.namespace} --service web-${targetService.name}  --cluster ${argv.argv.cluster}`,
    { stdio: 'inherit' },
  )
})()
