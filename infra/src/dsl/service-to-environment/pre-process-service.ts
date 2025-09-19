import {
  EnvironmentVariables,
  EnvironmentVariableValue,
  ExtraValues,
  Feature,
  Features,
  Hash,
  IngressForEnv,
  localFromDev,
  MissingSetting,
  OpsEnvWithLocal,
  PostgresInfo,
  PostgresInfoForEnv,
  RedisInfo,
  RedisInfoForEnv,
  ServiceDefinition,
  ServiceDefinitionForEnv,
  ValueType,
} from '../types/input-types'
import { EnvironmentConfig } from '../types/charts'
import { FeatureNames } from '../features'
import { ContainerSecrets, SerializeErrors } from '../types/output-types'
import { logger } from '../../common'

export function prepareServiceForEnv(
  service: ServiceDefinition,
  env: EnvironmentConfig,
):
  | {
      type: 'success'
      serviceDef: ServiceDefinitionForEnv
    }
  | SerializeErrors {
  logger.debug('prepareServiceForEnv', { serviceName: service.name })
  let allErrors: string[] = []
  const checkCollisions = (
    target: { [name: string]: any },
    source: { [name: string]: any },
  ) => {
    const targetKeys = Object.keys(target)
    addToErrors(
      Object.keys(source)
        .filter((srcKey) => targetKeys.includes(srcKey))
        .map(
          (key) =>
            `Collisions in ${service.name} for environment or secrets for key ${key}`,
        ),
    )
  }
  const mergeObjects = <T>(
    target: { [name: string]: T },
    source: { [name: string]: T },
  ) => {
    checkCollisions(target, source)
    Object.assign(target, source)
  }
  const addToErrors = (errors: string[]) => {
    allErrors.push(...errors)
  }
  const serviceDef = service

  if (serviceDef.env.NODE_OPTIONS) {
    throw new Error(
      'NODE_OPTIONS already set. At the moment of writing, there is no known use case for this, so this might need to be revisited in the future.',
    )
  }

  const { envs, errors } = getEnvVariables(
    serviceDef.env,
    serviceDef.name,
    env.type,
  )
  const ingress = Object.entries(serviceDef.ingress).reduce(
    (acc, [name, ingress]) => {
      const envType = localFromDev(env.type)
      return {
        ...acc,
        ...(ingress.host[envType] === MissingSetting
          ? {}
          : {
              [name]: {
                host: ingress.host[envType],
                pathTypeOverride: ingress.pathTypeOverride,
                paths: ingress.paths,
                public: ingress.public,
                extraAnnotations: ingress.extraAnnotations?.[envType],
              },
            }),
      }
    },
    {} as { [name: string]: IngressForEnv },
  )

  addToErrors(errors)
  let result: ServiceDefinitionForEnv = {
    features: serviceDef.features,
    files: serviceDef.files,
    grantNamespaces: serviceDef.grantNamespaces,
    grantNamespacesEnabled: serviceDef.grantNamespacesEnabled,
    ingress: ingress,
    liveness: serviceDef.liveness,
    namespace: serviceDef.namespace,
    resources: serviceDef.resources,
    securityContext: serviceDef.securityContext,
    serviceAccountEnabled: serviceDef.serviceAccountEnabled,
    accountName: serviceDef.accountName,
    healthPort: serviceDef.healthPort,
    volumes: serviceDef.volumes,
    port: serviceDef.port,
    env: envs,
    secrets: { ...serviceDef.secrets },
    name: serviceDef.name,
    replicaCount: serviceDef.replicaCount,
    image: serviceDef.image,
    args: serviceDef.args,
    cmds: serviceDef.cmds,
    readiness: serviceDef.readiness,
    podDisruptionBudget: serviceDef.podDisruptionBudget,
  }

  if (serviceDef.postgres) {
    result.postgres = getEnvPostgres(serviceDef.postgres!, env)
  }
  if (serviceDef.redis) {
    result.redis = getEnvRedis(serviceDef.redis, env)
  }
  // extra attributes
  if (serviceDef.extraAttributes) {
    const { errors, envs } = getEnvExtraValues(
      service,
      env,
      serviceDef.extraAttributes,
    )
    result.extraAttributes = envs
    addToErrors(errors)
  }

  const {
    envs: featureEnvs,
    errors: featureErrors,
    secrets: featureSecrets,
  } = addFeaturesConfig(serviceDef.features, env, serviceDef.name)
  mergeObjects(result.env, featureEnvs)
  addToErrors(featureErrors)
  mergeObjects(result.secrets, featureSecrets)

  if (serviceDef.xroadConfig) {
    serviceDef.xroadConfig.forEach((conf) => {
      const { envs, errors } = getEnvVariables(
        conf.getEnv(),
        serviceDef.name,
        env.type,
      )
      addToErrors(errors)
      mergeObjects(result.env, envs)
      mergeObjects(result.secrets, conf.getSecrets())
    })
  }

  // initContainers
  if (typeof serviceDef.initContainers !== 'undefined') {
    if (serviceDef.initContainers.containers.length > 0) {
      result.initContainers = {
        envs: {},
        secrets: { ...serviceDef.initContainers.secrets },
        features: serviceDef.initContainers.features,
        containers: [...serviceDef.initContainers.containers],
        postgres: serviceDef.initContainers.postgres
          ? getEnvPostgres(serviceDef.initContainers.postgres, env)
          : undefined,
      }

      if (typeof serviceDef.initContainers.envs !== 'undefined') {
        const { envs, errors } = getEnvVariables(
          serviceDef.initContainers.envs,
          `${serviceDef.name}-initContainers`,
          env.type,
        )
        addToErrors(errors)
        mergeObjects(result.initContainers.envs, envs)
      }
      if (serviceDef.initContainers.features) {
        const {
          envs: featureEnvs,
          errors: featureErrors,
          secrets: featureSecrets,
        } = addFeaturesConfig(
          serviceDef.initContainers.features,
          env,
          `${serviceDef.name}-initContainers`,
        )
        mergeObjects(result.initContainers.envs, featureEnvs)
        addToErrors(featureErrors)
        mergeObjects(result.initContainers.secrets, featureSecrets)
      }
      checkCollisions(
        result.initContainers?.secrets ?? {},
        result.initContainers?.envs ?? {},
      )
    } else {
      addToErrors(['No containers to run defined in initContainers'])
    }
  }

  checkCollisions(result.secrets, result.env)

  return allErrors.length === 0
    ? { type: 'success', serviceDef: result }
    : { type: 'error', errors: allErrors }
}

export function getEnvVariables(
  envs: EnvironmentVariables,
  serviceName: string,
  envType: OpsEnvWithLocal,
) {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      const r = getEnvValue(value, envType)
      switch (r.type) {
        case 'error':
          return {
            errors: acc.errors.concat([
              `Missing settings for service ${serviceName} in env ${envType}. Keys of missing settings: ${name}`,
            ]),
            envs: acc.envs,
          }
        case 'success':
          return {
            errors: acc.errors,
            envs: {
              ...acc.envs,
              [name]: r.value,
            },
          }
      }
    },
    { errors: [] as string[], envs: {} as { [name: string]: ValueType } },
  )
}

/**
 * Retrieves the environment variable value based on the specified environment type.
 *
 * @param {EnvironmentVariableValue} value - The environment variable value which can be a direct value or an object containing values for different environments.
 * @param {OpsEnvWithLocal} envType - The type of environment for which the value is needed. It can be 'local', 'dev', 'prod', etc.
 * @returns {{ type: 'error' } | { type: 'success'; value: ValueType }} - Returns an object indicating success or error. On success, it includes the retrieved value.
 */
function getEnvValue(
  value: EnvironmentVariableValue,
  envType: OpsEnvWithLocal,
): { type: 'error' } | { type: 'success'; value: ValueType } {
  // Check if the value is missing entirely
  if (value === MissingSetting) return { type: 'error' }

  // Check if the value is an object and the specific environment setting is missing
  if (typeof value === 'object' && value[envType] === MissingSetting) {
    return { type: 'error' }
  } else {
    // Handle the case where the environment type is 'local' and the local setting is undefined
    if (
      typeof value === 'object' &&
      envType === 'local' &&
      typeof value[envType] === 'undefined'
    ) {
      return {
        type: 'success',
        value: value.dev,
      }
    } else {
      // Return the value for the specified environment type
      return {
        type: 'success',
        value: typeof value === 'object' ? value[envType]! : value,
      }
    }
  }
}

function getEnvExtraValues(
  service: ServiceDefinition,
  env: EnvironmentConfig,
  extraValues: ExtraValues,
): { errors: string[]; envs: Hash } {
  const extraEnvsForType = extraValues[localFromDev(env.type)]
  if (extraEnvsForType === MissingSetting) {
    return {
      envs: {},
      errors: [
        `Missing extra setting for service ${service.name} in env ${env.type}`,
      ],
    }
  } else {
    return { errors: [], envs: extraEnvsForType }
  }
}
function getEnvPostgres(
  postgres: PostgresInfo,
  env: EnvironmentConfig,
): PostgresInfoForEnv {
  const { host, ...rest } = { host: 'default', ...postgres }
  return {
    ...rest,
    host: postgres.host?.[localFromDev(env.type)],
  }
}

function getEnvRedis(
  redis: RedisInfo,
  env: EnvironmentConfig,
): RedisInfoForEnv {
  return {
    host: redis.host?.[localFromDev(env.type)],
  }
}

function addFeaturesConfig(
  serviceDefFeatures: Partial<Features>,
  env: EnvironmentConfig,
  serviceName: string,
) {
  const activeFeatures = Object.entries(serviceDefFeatures).filter(
    ([feature]) => env.featuresOn.includes(feature as FeatureNames),
  ) as [FeatureNames, Feature][]
  const featureEnvs = activeFeatures.map(([name, v]) => {
    const { envs, errors } = getEnvVariables(v.env, serviceName, env.type)
    return {
      name,
      envs,
      errors,
    }
  })
  const featureSecrets = activeFeatures.map(([name, v]) => {
    return {
      name,
      secrets: v.secrets,
    }
  })
  return {
    envs: featureEnvs.reduce(
      (acc, feature) => ({ ...acc, ...feature.envs }),
      {} as { [name: string]: ValueType },
    ),
    secrets: featureSecrets.reduce(
      (acc, toggle) => ({ ...acc, ...toggle.secrets }),
      {} as ContainerSecrets,
    ),
    errors: featureEnvs.reduce(
      (acc, feature) => [...acc, ...feature.errors],
      [] as string[],
    ),
  }
}
