import yargs from 'yargs'
import { featureSpecificServiceDef } from '../infra/src/dsl/serialize-to-yaml'
import { Charts } from '../infra/src/uber-charts/all-charts'
import { Client } from 'pg'
import { SSM } from 'aws-sdk'
import { branchNameToFeatureName } from './_common'

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

  const habitat = Charts[chart].dev
  const target = habitat.filter(
    (service) => service.serviceDef.name === serviceName,
  )
  if (target.length != 1) {
    throw Error(`Service with name ${serviceName} not found in chart ${chart}`)
  }

  featureSpecificServiceDef(featureName, target)
  const targetService = target[0]
  targetService.serviceDef.postgres

  const ssmClient = new SSM({
    apiVersion: '2014-11-06',
    region: 'eu-west-1',
  })
  if (targetService.serviceDef.postgres) {
    console.log(
      `Retrieving secret ${targetService.serviceDef.postgres.passwordSecret}`,
    )
    const password = await ssmClient
      .getParameter({
        Name: targetService.serviceDef.postgres.passwordSecret!,
        WithDecryption: true,
      })
      .promise()
      .catch((r) => {
        console.error(`No DB password secret found. Wrong feature name?`)
        throw r
      })
    if (password.Parameter?.Value) {
      const client = new Client({
        user: targetService.serviceDef.postgres.username,
        host: 'localhost',
        database: targetService.serviceDef.postgres.name,
        password: password.Parameter!.Value,
      })
      await client.connect()
      console.log(`Connected to database`)
      await client.query(
        // Query to drop all tables taken from here - https://tableplus.com/blog/2018/04/postgresql-how-to-drop-all-tables.html
        `drop owned by ${targetService.serviceDef.postgres.username}`,
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
