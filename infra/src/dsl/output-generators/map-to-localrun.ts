import {
  PostgresInfoForEnv,
  Secrets,
  ServiceDefinition,
  ServiceDefinitionForEnv,
} from '../types/input-types'
import {
  ContainerEnvironmentVariables,
  LocalrunService,
  OutputFormat,
  SerializeErrors,
  SerializeSuccess,
} from '../types/output-types'
import { ReferenceResolver, EnvironmentConfig } from '../types/charts'
import { checksAndValidations } from './errors'
import {
  postgresIdentifier,
  serializeEnvironmentVariables,
} from './serialization-helpers'
import { getSsmParams } from '../adapters/get-ssm-params'
import { getPostgresExtensions } from './map-to-helm-values'
import { getScaledValue } from '../utils/scale-value'
import { logger } from '../../common'

/**
 * Transforms our definition of a service to a definition for a local running serivce
 * @param service Our service definition
 * @param deployment Uber chart in a specific environment the service will be part of
 * @param withSecrets Should secrets be retrieved from AWS Parameter store or not (useful for tests)
 */
const serializeService = async (
  service: ServiceDefinitionForEnv,
  deployment: ReferenceResolver,
  withSecrets: boolean,
  env: EnvironmentConfig,
): Promise<SerializeSuccess<LocalrunService> | SerializeErrors> => {
  logger.debug('Serializing service', {
    service: service.name,
    env,
  })
  const { addToErrors, mergeObjects, getErrors } = checksAndValidations(
    service.name,
  )
  const serviceDef = service
  const result: LocalrunService = {
    env: {
      SERVERSIDE_FEATURES_ON: env.featuresOn.join(','),
      NODE_OPTIONS: `--max-old-space-size=${getScaledValue(
        serviceDef.resources.limits.memory,
      )}`,
    },
    commands: [],
  }
  let initContainers: { [name: string]: LocalrunService } = {}

  // command and args
  if (serviceDef.cmds) {
    result.commands = [serviceDef.cmds!].concat(serviceDef.args ?? [])
  }

  // target port
  if (typeof serviceDef.port !== 'undefined') {
    result.port = serviceDef.port
  }

  // environment vars
  if (Object.keys(serviceDef.env).length > 0) {
    const { envs } = serializeEnvironmentVariables(
      service,
      deployment,
      serviceDef.env,
      env,
    )
    mergeObjects(result.env, envs)
  }

  // secrets
  if (Object.keys(serviceDef.secrets).length > 0 && withSecrets) {
    logger.debug('Retrieving secrets', {
      service: service.name,
      env: env,
    })
    const secrets = await retrieveSecrets(serviceDef.secrets)
    mergeObjects(result.env, secrets)
  }

  // initContainers
  if (typeof serviceDef.initContainers !== 'undefined') {
    initContainers = serviceDef.initContainers.containers.reduce(
      (acc, initContainer) => ({
        ...acc,
        [initContainer.name!]: {
          env: {
            SERVERSIDE_FEATURES_ON: env.featuresOn.join(','),
          },
        },
      }),
      {},
    )

    if (serviceDef.initContainers.containers.length > 0) {
      if (typeof serviceDef.initContainers.envs !== 'undefined') {
        const { envs } = serializeEnvironmentVariables(
          service,
          deployment,
          serviceDef.initContainers.envs,
          env,
        )
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
          serviceDef.initContainers.postgres,
        )

        Object.values(initContainers).forEach(
          (initContainer) => mergeObjects(initContainer.env, env),
          // mergeObjects(initContainer.secrets, secrets),
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
      serviceDef.postgres,
    )

    mergeObjects(result.env, env)
    // mergeObjects(secrets, secrets)
    addToErrors(errors)
  }

  // Map all external URLs to localhost
  for (const [key, value] of Object.entries(result.env)) {
    if (value.startsWith('https://')) {
      result.env[key] = value.replace(/https:\/\/[^/:]+/g, 'http://localhost')
    }
  }

  const allErrors = getErrors()
  return allErrors.length === 0
    ? { type: 'success', serviceDef: [result] }
    : { type: 'error', errors: allErrors }
}

const resolveDbHost = () => {
  return {
    writer: 'db',
    reader: 'db',
  }
}

function serializePostgres(
  serviceDef: ServiceDefinitionForEnv,
  postgres: PostgresInfoForEnv,
) {
  const env: { [name: string]: string } = {}
  const secrets: { [name: string]: string } = {}
  const errors: string[] = []
  env['DB_USER'] = 'testdb'
  env['DB_NAME'] = postgres.name ?? postgresIdentifier(serviceDef.name)
  if (serviceDef.initContainers?.postgres?.extensions) {
    env['DB_EXTENSIONS'] = getPostgresExtensions(
      serviceDef.initContainers.postgres.extensions,
    )
  }
  try {
    const { reader, writer } = resolveDbHost()
    env['DB_HOST'] = writer
    env['DB_REPLICAS_HOST'] = reader
  } catch (e) {
    errors.push(
      `Could not resolve DB_HOST variable for service: ${serviceDef.name}`,
    )
  }
  secrets['DB_PASS'] = 'testdb'
  return { env, secrets, errors }
}

type RetrieveSecrets = (
  secrets: Secrets,
) => Promise<ContainerEnvironmentVariables>
const retrieveSecrets: RetrieveSecrets = async (
  secrets: Secrets,
): Promise<ContainerEnvironmentVariables> => {
  const secretPaths = Object.entries(secrets).map((entry) => entry[1])
  const secretValues = await getSsmParams(secretPaths)
  return Object.entries(secrets)
    .map((entry) => [entry[0], secretValues[entry[1]]])
    .reduce(
      (acc, item) => ({ ...acc, [item[0]]: item[1] }),
      {} as { [name: string]: string },
    )
}

export enum SecretOptions {
  withSecrets,
  noSecrets,
}

export function LocalrunOutput(options: { secrets: SecretOptions }) {
  return {
    featureDeployment(
      service: ServiceDefinition,
      env: EnvironmentConfig,
    ): void {},
    serializeService(
      service: ServiceDefinitionForEnv,
      deployment: ReferenceResolver,
      env: EnvironmentConfig,
      featureDeployment,
    ) {
      return serializeService(
        service,
        deployment,
        options.secrets === SecretOptions.withSecrets,
        env,
      )
    },

    serviceMockDef(options): LocalrunService {
      throw new Error('Not used')
    },
  } as OutputFormat<LocalrunService>
}
