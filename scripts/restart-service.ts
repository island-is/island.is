#!/usr/bin/env ts-node
import yargs from 'yargs'
import { featureSpecificServiceDef } from '../infra/src/dsl/serialize-to-yaml'
import { Charts } from '../infra/src/uber-charts/all-charts'
import { execSync } from 'child_process'
import { branchNameToFeatureName } from './_common'

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
        'dev-cluster01',
        'staging-cluster01',
        'prod-cluster01',
        'ids-prod-cluster01',
      ],
      demandOption: true,
      description: 'Cluster ID',
      default: 'dev-cluster01',
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

  if (argv.argv['feature-branch-name']) {
    const featureName = branchNameToFeatureName(
      argv.argv['feature-branch-name'],
    )
    featureSpecificServiceDef(featureName, target)
  }
  const targetService = target[0]
  targetService.serviceDef.postgres
  execSync(
    `${__dirname}/_run-aws-eks-commands.js restart-service --namespace ${targetService.serviceDef.namespace} --service web-${targetService.serviceDef.name}  --cluster ${argv.argv.cluster}`,
    { stdio: 'inherit' },
  )
})()
