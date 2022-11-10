import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import AWS from 'aws-sdk'
import { Kubernetes } from './dsl/kubernetes-runtime'
import { Envs } from './environments'
import {
  ExcludedFeatureDeploymentServices,
  FeatureDeploymentServices,
  Services as IslandisServices,
} from './uber-charts/islandis'
import { Services as IDSServices } from './uber-charts/identity-server'
import { EnvironmentServices } from './dsl/types/charts'
import { ServiceHelm, Services } from './dsl/types/output-types'
import { Deployments } from './uber-charts/all-charts'
import { getFeatureAffectedServices } from './dsl/feature-deployments'
import { dumpJobYaml } from './dsl/file-formats/yaml'
import {
  renderDockerComposeValueFileContent,
  renderHelmJobForFeature,
  renderHelmServices,
  renderHelmValueFileContent,
} from './dsl/exports/exports'
import { toServices } from './dsl/exports/to-services'

type ChartName = 'islandis' | 'identity-server'

const charts: { [name in ChartName]: EnvironmentServices } = {
  islandis: IslandisServices,
  'identity-server': IDSServices,
}

interface Arguments {
  feature: string
  images: string
  chart: ChartName
  output?: string
  jobImage?: string
}

const writeToOutput = async (data: string, output?: string) => {
  if (output) {
    if (output.startsWith('s3://')) {
      const Bucket = output.substr(5).split('/')[0]
      const Key = output.substr(5).split(/\/(.+)/)[1]
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
        console.log(`Successfully uploaded data to ${output}`)
      } catch (err) {
        console.log('Error', err)
      }
    }
  } else {
    console.log(data)
  }
}

const parseArguments = (argv: Arguments) => {
  const feature = argv.feature
  const images = argv.images.split(',') // Docker images that have changed
  const env = 'dev'
  const chart = argv.chart as ChartName

  const ch = new Kubernetes({
    ...Envs[Deployments[chart][env]],
    feature: feature,
  })

  const habitat = charts[chart][env]

  const affectedServices = habitat
    .concat(FeatureDeploymentServices)
    .filter(
      (h) =>
        (images.length === 1 && images[0] === '*') ||
        images?.includes(h.serviceDef.image ?? h.serviceDef.name),
    )
  return { ch, habitat, affectedServices }
}

const buildIngressComment = (data: ServiceHelm[]): string =>
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

const buildComment = (data: Services<ServiceHelm>): string => {
  return `Feature deployment successful! Access your feature here:\n\n${buildIngressComment(
    Object.values(data),
  )}`
}

yargs(hideBin(process.argv))
  .command(
    'values',
    'get helm values file',
    () => {},
    async (argv: Arguments) => {
      const { ch, habitat, affectedServices } = parseArguments(argv)
      const featureYaml = await getFeatureAffectedServices(
        ch,
        toServices(habitat),
        toServices(affectedServices.slice()),
        toServices(ExcludedFeatureDeploymentServices),
      )
      await writeToOutput(
        await renderDockerComposeValueFileContent(ch.env, featureYaml),
        argv.output,
      )
    },
  )
  .command(
    'ingress-comment',
    'get helm values file',
    () => {},
    async (argv: Arguments) => {
      const { ch, habitat, affectedServices } = parseArguments(argv)
      const featureYaml = await getFeatureAffectedServices(
        ch,
        toServices(habitat),
        toServices(affectedServices.slice()),
        toServices(ExcludedFeatureDeploymentServices),
      )
      await writeToOutput(
        buildComment(await renderHelmServices(ch.env, featureYaml)),
        argv.output,
      )
    },
  )
  .command(
    'jobs',
    'get kubernetes jobs to bootstrap feature environment',
    (yargs) => {
      yargs.option('jobImage', {
        type: 'string',
        description: 'Image to run feature bootstrapping jobs',
        demandOption: true,
      })
    },
    async (argv: Arguments) => {
      const { ch, habitat, affectedServices } = parseArguments(argv)
      const featureYaml = await renderHelmJobForFeature(
        ch,
        toServices(habitat),
        argv.jobImage!,
        toServices(affectedServices),
      )
      await writeToOutput(dumpJobYaml(featureYaml), argv.output)
    },
  )
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
      choices: ['islandis', 'identity-server'],
      demandOption: true,
      description: 'Name of the umbrella chart to use',
    },
    output: {
      description:
        'Where to output the yaml file. If omitted, will use stdout.',
    },
  })
  .demandCommand().argv
