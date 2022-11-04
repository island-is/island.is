import {
  PostgresInfoForEnv,
  Secrets,
  Service,
  ServiceDefinitionForEnv,
} from './types/input-types'
import {
  ContainerEnvironmentVariables,
  DockerComposeService,
  OutputFormat,
  SerializeErrors,
  SerializeMethod,
  SerializeSuccess,
} from './types/output-types'
import { DeploymentRuntime } from './types/charts'
import { SSM } from '@aws-sdk/client-ssm'
import { ServerSideFeature } from '../../../libs/feature-flags/src'
import { checksAndValidations } from './errors'
import { processService } from './pre-process-service'
import {
  postgresIdentifier,
  serializeEnvironmentVariables,
} from './serialization-helpers'

/**
 * Transforms our definition of a service to a Helm values object
 * @param service Our service definition
 * @param deployment Uber chart in a specific environment the service will be part of
 */
export const serializeService: SerializeMethod<DockerComposeService> = (
  service: Service,
  deployment: DeploymentRuntime,
) => {
  const {
    addToErrors,
    mergeObjects,
    checkCollisions,
    getErrors,
  } = checksAndValidations(service.serviceDef.name)
  const processedService = processService(service, deployment.env)
  if (processedService.type === 'success') {
    const serviceDef = processedService.serviceDef
    // const {
    //   grantNamespaces,
    //   grantNamespacesEnabled,
    //   namespace,
    //   securityContext,
    // } = serviceDef
    const dockerImage = `821090935708.dkr.ecr.eu-west-1.amazonaws.com/${
      serviceDef.image ?? serviceDef.name
    }`
    const result: DockerComposeService = {
      image: dockerImage,
      env: {
        SERVERSIDE_FEATURES_ON: deployment.env.featuresOn.join(','),
        NODE_OPTIONS: `--max-old-space-size=${
          parseInt(serviceDef.resources.limits.memory, 10) - 48
        }`,
      },
      depends_on: {},
      command: [],
    }
    let initContainers: { [name: string]: DockerComposeService } = {}

    // command and args
    if (serviceDef.cmds) {
      result.command = [serviceDef.cmds!].concat(serviceDef.args ?? [])
    }

    // target port
    if (typeof serviceDef.port !== 'undefined') {
      result.port = serviceDef.port
    }

    // environment vars
    if (Object.keys(serviceDef.env).length > 0) {
      const { envs, errors } = serializeEnvironmentVariables(
        service,
        deployment,
        serviceDef.env,
      )
      addToErrors(errors)
      mergeObjects(result.env, envs)
    }

    // secrets
    let secrets: Secrets = {}
    if (Object.keys(serviceDef.secrets).length > 0) {
      // secrets = await retrieveSecrets(serviceDef.secrets)
    }

    // initContainers
    if (typeof serviceDef.initContainers !== 'undefined') {
      initContainers = serviceDef.initContainers.containers.reduce(
        (acc, initContainer) => ({
          ...acc,
          [initContainer.name!]: {
            image: dockerImage,
            env: {
              SERVERSIDE_FEATURES_ON: deployment.env.featuresOn.join(','),
            },
            depends_on: {},
          },
        }),
        {},
      )

      if (serviceDef.initContainers.containers.length > 0) {
        if (typeof serviceDef.initContainers.envs !== 'undefined') {
          const { envs, errors } = serializeEnvironmentVariables(
            service,
            deployment,
            serviceDef.initContainers.envs,
          )
          addToErrors(errors)
          Object.values(initContainers).forEach((initContainer) =>
            mergeObjects(initContainer.env, envs),
          )
        }
        if (typeof serviceDef.initContainers.secrets !== 'undefined') {
          // result.initContainer.secrets = serviceDef.initContainers.secrets
        }
        if (serviceDef.initContainers.postgres) {
          const { env, secrets, errors } = serializePostgres(
            serviceDef,
            deployment,
            service,
            serviceDef.initContainers.postgres,
          )

          Object.values(initContainers).forEach((initContainer) =>
            mergeObjects(initContainer.env, env),
          )
          // mergeObjects(result.initContainer.secrets, secrets)
          addToErrors(errors)
        }
        // checkCollisions()
      } else {
        addToErrors(['No containers to run defined in initContainers'])
      }
    }

    if (serviceDef.postgres) {
      const { env, secrets, errors } = serializePostgres(
        serviceDef,
        deployment,
        service,
        serviceDef.postgres,
      )

      mergeObjects(result.env, env)
      // mergeObjects(secrets, secrets)
      addToErrors(errors)
    }

    checkCollisions(secrets, result.env)

    const allErrors = getErrors()
    return allErrors.length === 0
      ? { type: 'success', serviceDef: [result] }
      : { type: 'error', errors: allErrors }
  } else {
    return { type: 'error', errors: processedService.errors }
  }
}

const resolveDbHost = (
  postgres: PostgresInfoForEnv,
  deployment: DeploymentRuntime,
  service: Service,
) => {
  return {
    writer: 'db',
    reader: 'db',
  }
}

function serializePostgres(
  serviceDef: ServiceDefinitionForEnv,
  deployment: DeploymentRuntime,
  service: Service,
  postgres: PostgresInfoForEnv,
) {
  const env: { [name: string]: string } = {}
  const secrets: { [name: string]: string } = {}
  const errors: string[] = []
  env['DB_USER'] = postgres.username ?? postgresIdentifier(serviceDef.name)
  env['DB_NAME'] = postgres.name ?? postgresIdentifier(serviceDef.name)
  try {
    const { reader, writer } = resolveDbHost(postgres, deployment, service)
    env['DB_HOST'] = writer
    env['DB_REPLICAS_HOST'] = reader
  } catch (e) {
    errors.push(
      `Could not resolve DB_HOST variable for service: ${serviceDef.name}`,
    )
  }
  secrets['DB_PASS'] =
    postgres.passwordSecret ?? `/k8s/${serviceDef.name}/DB_PASSWORD`
  return { env, secrets, errors }
}

const API_INITIALIZATION_OPTIONS = {
  region: 'eu-west-1',
  maxAttempts: 10,
}

const EXCLUDED_ENVIRONMENT_NAMES = [
  'DB_PASSWORD',
  'NOVA_USERNAME',
  'NOVA_PASSWORD',
]

const OVERRIDE_ENVIRONMENT_NAMES: Record<string, string> = {
  IDENTITY_SERVER_CLIENT_SECRET: '/k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET',
}

const client = new SSM(API_INITIALIZATION_OPTIONS)

const retrieveSecrets = async (
  secrets: Secrets,
): Promise<ContainerEnvironmentVariables> => {
  const secretPaths = Object.entries(secrets).map((entry) => entry[1])
  const secretValues = await getParams(secretPaths)
  return Object.entries(secrets)
    .map((entry) => [entry[0], secretValues[entry[1]]])
    .reduce(
      (acc, item) => ({ ...acc, [item[0]]: item[1] }),
      {} as { [name: string]: string },
    )
}

const getParams = async (
  ssmNames: string[],
): Promise<{ [name: string]: string }> => {
  const chunks = ssmNames.reduce((all: string[][], one: string, i: number) => {
    const ch = Math.floor(i / 10)
    all[ch] = ([] as string[]).concat(all[ch] || [], one)
    return all
  }, [])

  const allParams = await Promise.all(
    chunks.map((Names) =>
      client.getParameters({ Names, WithDecryption: true }),
    ),
  )
  return allParams
    .map(({ Parameters }) =>
      Object.fromEntries(Parameters!.map((p) => [p.Name, p.Value])),
    )
    .reduce((p, c) => ({ ...p, ...c }), {})
}
export const serviceMockDef = (options: {
  namespace: string
  target: string
}): DockerComposeService => {
  return {
    image: 'wiremock',
    env: {},
    command: ['mock'],
    depends_on: {},
  }
}

export const DockerComposeOutput: OutputFormat<DockerComposeService> = {
  serializeService(
    service: Service,
    deployment: DeploymentRuntime,
    featuresOn?: ServerSideFeature[],
  ): SerializeSuccess<DockerComposeService> | SerializeErrors {
    return serializeService(service, deployment)
  },

  serviceMockDef(options: {
    namespace: string
    target: string
  }): DockerComposeService {
    return serviceMockDef(options)
  },
}
