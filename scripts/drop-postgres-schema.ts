import yargs from 'yargs'
import { Charts, Deployments } from '../infra/src/uber-charts/all-charts'
import { Client } from 'pg'
import { SSM } from 'aws-sdk'
import { branchNameToFeatureName } from './_common'
import { prepareServicesForEnv } from '../infra/src/dsl/processing/rendering-pipeline'
import { Envs } from '../infra/src/environments'
import { renderers } from '../infra/src/dsl/upstream-dependencies'

const argv = yargs(process.argv.slice(2))
  .options({
    'feature-branch-name': {
      type: 'string',
      demandOption: true,
    },
    'service-name': {
      type: 'string',
      demandOption: true,
    },
    chart: {
      choices: ['islandis', 'judicial-system'],
      demandOption: true,
      description: 'Name of the umbrella chart to use',
    },
  })
  .showHelpOnFail(true)
  .epilogue(
    `Drop DB schema for a feature deployment. You need to have your local DB proxy running`,
  )

void (async function () {
  const featureName = branchNameToFeatureName(argv.argv['feature-branch-name'])
  const serviceName = argv.argv['service-name']
  const chart = argv.argv.chart as keyof typeof Charts
  const env = 'dev' as const
  const habitat = Charts[chart][env]
  const target = habitat.filter(
    (service) => service.serviceDef.name === serviceName,
  )
  if (target.length != 1) {
    throw Error(`Service with name ${serviceName} not found in chart ${chart}`)
  }

  const out = prepareServicesForEnv({
    env: { ...Envs[Deployments[chart][env]], feature: featureName },
    outputFormat: renderers.helm,
    services: target[0],
  })
  const targetService = out[0]

  const ssmClient = new SSM({
    apiVersion: '2014-11-06',
    region: 'eu-west-1',
  })
  if (targetService.postgres) {
    console.log(`Retrieving secret ${targetService.postgres.passwordSecret}`)
    const password = await ssmClient
      .getParameter({
        Name: targetService.postgres.passwordSecret!,
        WithDecryption: true,
      })
      .promise()
      .catch((r) => {
        console.error(`No DB password secret found. Wrong feature name?`)
        throw r
      })
    if (password.Parameter?.Value) {
      const client = new Client({
        user: targetService.postgres.username,
        host: 'localhost',
        database: targetService.postgres.name,
        password: password.Parameter!.Value,
      })
      await client.connect()
      console.log(`Connected to database`)
      await client.query(
        // Query to drop all tables taken from here - https://tableplus.com/blog/2018/04/postgresql-how-to-drop-all-tables.html
        `drop owned by ${targetService.postgres.username}`,
      )
      console.log(`Done`)
      await client.end()
    } else {
      console.error(`No DB password found`)
    }
  } else {
    console.error(`Service ${serviceName} does not have postgres info it seems`)
  }
})()
