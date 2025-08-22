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
  renderCleanUpForFeature,
} from './dsl/exports/helm'
import { ServiceBuilder } from './dsl/dsl'
import { logger } from './logging'
import fs from 'fs'

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
  cleanupImage?: string
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
  return {
    habitat,
    affectedServices,
    env,
    skipAppName: argv.skipAppName as boolean,
    writeDest: argv.writeDest as string,
    disableNsGrants: argv.disableNsGrants as boolean,
  }
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
    builder: (yargs) => {
      return yargs
        .option('withMocks', {
          type: 'string',
          description: 'Include mocks in the values file',
          default: 'false',
        })
        .option('skipAppName', {
          type: 'boolean',
          description: 'Skip app name in the values file',
          default: false,
        })
        .option('writeDest', {
          type: 'string',
          description:
            'Template location where to write files to for down stream apps',
          default: '',
        })
        .option('disableNsGrants', {
          type: 'boolean',
          description: 'Disable namespace grants in rendered output',
          default: false,
        })
    },
    handler: async (argv) => {
      const typedArgv = argv as unknown as Arguments
      const {
        habitat,
        affectedServices,
        env,
        skipAppName,
        writeDest,
        disableNsGrants,
      } = parseArguments(typedArgv)
      let { included: featureYaml } = await getFeatureAffectedServices(
        habitat,
        affectedServices.slice(),
        ExcludedFeatureDeploymentServices,
        env,
      )

      featureYaml.map(async (svc) => {
        if (disableNsGrants) {
          svc.serviceDef.grantNamespacesEnabled = false
        }

        const svcString = await renderHelmValueFileContent(
          env,
          habitat,
          [svc],
          (typedArgv.withMocks ?? 'false') === 'true'
            ? 'with-mocks'
            : 'no-mocks',
          skipAppName,
        )

        if (writeDest != '') {
          try {
            fs.mkdirSync(`${writeDest}/${svc.name()}`, { recursive: true })
            console.log(
              `writing file to directory: ${writeDest}/${svc.name()}/values.yaml`,
            )
            fs.writeFileSync(
              `${writeDest}/${svc.name()}/values.yaml`,
              svcString,
            )
          } catch (error) {
            console.log(`Failed to write values file for ${svc.name()}:`, error)
            throw new Error(`Failed to write values file for ${svc.name()}`)
          }
        } else {
          writeToOutput(svcString, typedArgv.output)
        }
      })
    },
  })
  .command({
    command: 'downstream',
    describe: 'get downstream services',
    builder: () => {
      return yargs
    },
    handler: async (argv) => {
      const typedArgv = argv as unknown as Arguments
      const {
        habitat,
        affectedServices,
        env,
        skipAppName,
        writeDest,
        disableNsGrants,
      } = parseArguments(typedArgv)
      const { included: featureYaml } = await getFeatureAffectedServices(
        habitat,
        affectedServices.slice(),
        ExcludedFeatureDeploymentServices,
        env,
      )

      const affectedServiceNames = affectedServices.map((svc) => svc.name())

      const formattedList = featureYaml
        .map((svc) => svc.name())
        .filter((name) => !affectedServiceNames.includes(name))

      // BFF hack since the service name is not equal to the nx app name
      const correctedFormattedList = Array.from(
        new Set(
          formattedList.map((name) => {
            if (name.includes('services-bff-portals')) {
              return 'services-bff'
            } else {
              return name
            }
          }),
        ),
      ).toString()

      writeToOutput(correctedFormattedList, typedArgv.output)
    },
  })
  .command({
    command: 'ingress-comment',
    describe: 'get helm values file',
    builder: (yargs) => yargs,
    handler: async (argv) => {
      const typedArgv = argv as unknown as Arguments
      const { habitat, affectedServices, env } = parseArguments(typedArgv)
      const { included: featureYaml, excluded } =
        await getFeatureAffectedServices(
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
      return yargs
        .option('jobImage', {
          type: 'string',
          description: 'Image to run feature bootstrapping jobs',
          demandOption: true,
        })
        .option('writeDest', {
          type: 'string',
          description:
            'Template location where to write files to for down stream apps',
          default: '',
        })
    },
    handler: async (argv) => {
      const typedArgv = argv as unknown as Arguments
      const { affectedServices, env, writeDest } = parseArguments(typedArgv)
      const featureYaml = await renderHelmJobForFeature(
        env,
        typedArgv.jobImage!,
        affectedServices,
      )

      if (
        featureYaml.spec.template.spec.containers.length <= 0 ||
        affectedServices.length <= 0
      ) {
        return
      }

      const svcString = dumpJobYaml(featureYaml)

      if (writeDest != '') {
        try {
          fs.mkdirSync(`${writeDest}/${affectedServices[0].name()}`, {
            recursive: true,
          })
          console.log(
            `writing file to: ${writeDest}/${affectedServices[0].name()}/bootstrap-fd-job.yaml}`,
          )
          fs.writeFileSync(
            `${writeDest}/${affectedServices[0].name()}/bootstrap-fd-job.yaml`,
            svcString,
          )
        } catch (error) {
          console.log(
            `Failed to write values file for ${affectedServices[0].name()}:`,
            error,
          )
          throw new Error(
            `Failed to write values for ${affectedServices[0].name()}`,
          )
        }
      } else {
        await writeToOutput(svcString, typedArgv.output)
      }
    },
  })
  .command({
    command: 'cleanup',
    describe: 'get kubernetes jobs to cleanup feature environment',
    builder: (yargs) => {
      return yargs
        .option('cleanupImage', {
          type: 'string',
          description: 'Image to run feature cleanup jobs',
          demandOption: true,
        })
        .option('writeDest', {
          type: 'string',
          description:
            'Template location where to write files to for down stream apps',
          default: '',
        })
        .option('containerCommand', {
          type: 'string',
          description: 'Command to run in the container',
          default: 'cleanup',
        })
    },
    handler: async (argv) => {
      const typedArgv = argv as unknown as Arguments
      const { affectedServices, env, writeDest } = parseArguments(typedArgv)
      const featureYaml = await renderCleanUpForFeature(
        env,
        typedArgv.cleanupImage!,
        affectedServices,
      )

      if (
        featureYaml.spec.template.spec.containers.length <= 0 ||
        affectedServices.length <= 0
      ) {
        return
      }

      const svcString = dumpJobYaml(featureYaml)

      if (writeDest != '') {
        try {
          fs.mkdirSync(`${writeDest}/${affectedServices[0].name()}`, {
            recursive: true,
          })
          console.log(
            `writing file to: ${writeDest}/${affectedServices[0].name()}/cleanup-fd-job.yaml}`,
          )
          fs.writeFileSync(
            `${writeDest}/${affectedServices[0].name()}/cleanup-fd-job.yaml`,
            svcString,
          )
        } catch (error) {
          console.log(
            `Failed to write values file for ${affectedServices[0].name()}:`,
            error,
          )
          throw new Error(
            `Failed to write values for ${affectedServices[0].name()}`,
          )
        }
      } else {
        await writeToOutput(svcString, typedArgv.output)
      }
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
