import yargs, { ArgumentsCamelCase } from 'yargs'
import AWS from 'aws-sdk'
import { Envs } from './environments'
import {
  ExcludedFeatureDeploymentServices,
  FeatureDeploymentServices,
  Services as IslandisServices,
} from './uber-charts/islandis'
import { Services as IDSServices } from './uber-charts/identity-server'
import { EnvironmentServices } from './dsl/types/charts'
import { HelmService, Services } from './dsl/types/output-types'
import { Deployments } from './uber-charts/all-charts'
import { getFeatureAffectedServices } from './dsl/feature-deployments'
import { dumpJobYaml } from './dsl/file-formats/yaml'
import {
  renderHelmJobForFeature,
  renderHelmServices,
  renderHelmValueFileContent,
} from './dsl/exports/helm'
import { ServiceBuilder } from './dsl/dsl'
import { logger } from './logging'

type ChartName = 'islandis' | 'identity-server'

const charts: { [name in ChartName]: EnvironmentServices } = {
  islandis: IslandisServices,
  'identity-server': IDSServices,
}

interface Arguments extends ArgumentsCamelCase {
  feature: string
  images: string
  chart: ChartName
  output?: string
  jobImage?: string
  withMocks?: 'true' | 'false'
}

const writeToOutput = async (data: string, output?: string) => {
  if (output) {
    if (output.startsWith('s3://')) {
      const Bucket = output.substring(5).split('/')[0]
      const Key = output.substring(5).split(/\/(.+)/)[1]
      const objectParams = {
        Bucket,
        Key,
        Body: data,
        ACL: 'bucket-owner-full-control',
      }
      const config = {
        region: 'eu-west-1',
      }
      const s3 = new AWS.S3(config)
      try {
        await s3.putObject(objectParams).promise()
        logger.info(`Successfully uploaded data to ${output}`)
      } catch (err) {
        logger.error('Error', err)
      }
    }
  } else {
    console.log(data)
  }
}

const parseArguments = (argv: Arguments) => {
  const feature = argv.feature
  const images = argv.images.split(',').sort() // Docker images that have changed
  const envName = 'dev'
  const chart = argv.chart as ChartName
  const env = {
    ...Envs[Deployments[chart][envName]],
    feature: feature,
  }
  logger.debug('parseArguments', { envName, chart, feature, images, env })

  const habitat = charts[chart][envName]
  logger.info(
    `Services in ${chart} chart (${envName}):`,
    habitat.map((x) => x.serviceDef.name).sort(),
  )

  const affectedServices = habitat
    .concat(FeatureDeploymentServices)
    .filter(
      (h) =>
        (images.length === 1 && images[0] === '*') ||
        images?.includes(h.serviceDef.image ?? h.serviceDef.name),
    )
  const affectedSet = new Set(affectedServices.map((x) => x.serviceDef.name))
  logger.info('Affected services', {
    services: affectedServices.map((x) => x.name()).sort(),
    unaffected: habitat
      .map((x) => x.name())
      .sort()
      .filter((x) => !affectedSet.has(x)),
  })
  return { habitat, affectedServices, env }
}

const buildIngressComment = (data: HelmService[]): string =>
  data
    .filter((obj) => obj.ingress)
    .map(({ ingress }) => Object.values(ingress!))
    .flat()
    .map(({ hosts }) => hosts)
    .flat()
    .map(({ host, paths }) => paths.map((path) => `https://${host}${path}`))
    .flat()
    .sort()
    .join('\n')

const buildComment = (data: Services<HelmService>): string => {
  return `Feature deployment of your services will begin shortly. Your feature will be accessible here:\n${
    buildIngressComment(Object.values(data)) ??
    'Feature deployment of your services will begin shortly. No web endpoints defined (no ingresses were defined)'
  }`
}
const deployedComment = (
  data: ServiceBuilder<any>[],
  excluded: string[],
): string => {
  return `Deployed services: ${data
    .map((d) => d.name())
    .join(',')}. \n Excluded services: \`${excluded.join(',')}\``
}

yargs(process.argv.slice(2))
  .command({
    command: 'values',
    describe: 'get helm values file',
    builder: (yargs) =>
      yargs.option('withMocks', {
        type: 'string',
        description: 'Include mocks in the values file',
        default: 'false',
      }),
    handler: async (argv) => {
      const typedArgv = (argv as unknown) as Arguments
      const { habitat, affectedServices, env } = parseArguments(typedArgv)
      const { included: featureYaml } = await getFeatureAffectedServices(
        habitat,
        affectedServices.slice(),
        ExcludedFeatureDeploymentServices,
        env,
      )
      await writeToOutput(
        await renderHelmValueFileContent(
          env,
          habitat,
          featureYaml,
          (typedArgv.withMocks ?? 'false') === 'true'
            ? 'with-mocks'
            : 'no-mocks',
        ),
        typedArgv.output,
      )
    },
  })
  .command({
    command: 'ingress-comment',
    describe: 'get helm values file',
    builder: (yargs) => yargs,
    handler: async (argv) => {
      const typedArgv = (argv as unknown) as Arguments
      const { habitat, affectedServices, env } = parseArguments(typedArgv)
      const {
        included: featureYaml,
        excluded,
      } = await getFeatureAffectedServices(
        habitat,
        affectedServices.slice(),
        ExcludedFeatureDeploymentServices,
        env,
      )
      const ingressComment = buildComment(
        (await renderHelmServices(env, habitat, featureYaml, 'no-mocks'))
          .services,
      )
      const includedServicesComment = deployedComment(featureYaml, excluded)
      await writeToOutput(
        `${ingressComment}\n\n${includedServicesComment}`,
        typedArgv.output,
      )
    },
  })
  .command({
    command: 'jobs',
    describe: 'get kubernetes jobs to bootstrap feature environment',
    builder: (yargs) => {
      return yargs.option('jobImage', {
        type: 'string',
        description: 'Image to run feature bootstrapping jobs',
        demandOption: true,
      })
    },
    handler: async (argv) => {
      const typedArgv = (argv as unknown) as Arguments
      const { affectedServices, env } = parseArguments(typedArgv)
      const featureYaml = await renderHelmJobForFeature(
        env,
        typedArgv.jobImage!,
        affectedServices,
      )
      await writeToOutput(dumpJobYaml(featureYaml), typedArgv.output)
    },
  })
  .options({
    feature: {
      type: 'string',
      demandOption: true,
      description: 'Name of the feature you are deploying',
    },
    images: {
      type: 'string',
      demandOption: true,
      description:
        'List of comma separated Docker image names that have changed',
    },
    chart: {
      choices: ['islandis', 'identity-server'] as const,
      demandOption: true,
      description: 'Name of the umbrella chart to use',
    },
    output: {
      description:
        'Where to output the yaml file. If omitted, will use stdout.',
    },
  })
  .demandCommand().argv
