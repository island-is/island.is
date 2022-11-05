import {
  EnvironmentVariables,
  EnvironmentVariableValue,
  ExtraValues,
  Feature,
  Features,
  Hash,
  IngressForEnv,
  MissingSetting,
  PostgresInfo,
  PostgresInfoForEnv,
  Service,
  ServiceDefinitionForEnv,
  ValueType,
} from '../types/input-types'
import { EnvironmentConfig } from '../types/charts'
import { FeatureNames } from '../features'
import { ContainerSecrets, SerializeErrors } from '../types/output-types'

export const prepareServiceForEnv = (
  service: Service,
  env: EnvironmentConfig,
):
  | {
      type: 'success'
      serviceDef: ServiceDefinitionForEnv
    }
  | SerializeErrors => {
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
            `Collisions in ${service.serviceDef.name} for environment or secrets for key ${key}`,
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
  const serviceDef = service.serviceDef

  if (serviceDef.env.NODE_OPTIONS) {
    throw new Error(
      'NODE_OPTIONS already set. At the moment of writing, there is no known use case for this, so this might need to be revisited in the future.',
    )
  }

  const { envs, errors } = getEnvVariables(serviceDef.env, env, serviceDef.name)
  const ingress = Object.entries(serviceDef.ingress).reduce(
    (acc, [name, ingress]) => {
      return {
        ...acc,
        ...(ingress.host[env.type] === MissingSetting
          ? {}
          : {
              [name]: {
                host: ingress.host[env.type],
                paths: ingress.paths,
                public: ingress.public,
                extraAnnotations: ingress.extraAnnotations?.[env.type],
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
  }

  if (serviceDef.postgres) {
    result.postgres = getEnvPostgres(serviceDef.postgres!, env)
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

  serviceDef.xroadConfig.forEach((conf) => {
    const { envs, errors } = getEnvVariables(
      conf.getEnv(),
      env,
      serviceDef.name,
    )
    addToErrors(errors)
    mergeObjects(result.env, envs)
    mergeObjects(result.secrets, conf.getSecrets())
  })

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
          env,
          `${serviceDef.name}-initContainers`,
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
  env: EnvironmentConfig,
  serviceName: string,
) {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      const r = getEnvValue(value, env)
      switch (r.type) {
        case 'error':
          return {
            errors: acc.errors.concat([
              `Missing settings for service ${serviceName} in env ${env.type}. Keys of missing settings: ${name}`,
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

function getEnvValue(
  value: EnvironmentVariableValue,
  env: EnvironmentConfig,
): { type: 'error' } | { type: 'success'; value: ValueType } {
  if (value === MissingSetting) return { type: 'error' }
  if (typeof value === 'object' && value[env.type] === MissingSetting)
    return { type: 'error' }
  return {
    type: 'success',
    value: typeof value === 'object' ? value[env.type] : value,
  }
}

function getEnvExtraValues(
  service: Service,
  env: EnvironmentConfig,
  extraValues: ExtraValues,
): { errors: string[]; envs: Hash } {
  const extraEnvsForType = extraValues[env.type]
  if (extraEnvsForType === MissingSetting) {
    return {
      envs: {},
      errors: [
        `Missing extra setting for service ${service.serviceDef.name} in env ${env.type}`,
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
    host: postgres.host?.[env.type],
  }
}

function addFeaturesConfig(
  serviceDefFeatures: Partial<Features>,
  env: EnvironmentConfig,
  serviceName: string,
) {
  const activeFeatures = Object.entries(
    serviceDefFeatures,
  ).filter(([feature]) => env.featuresOn.includes(feature as FeatureNames)) as [
    FeatureNames,
    Feature,
  ][]
  const featureEnvs = activeFeatures.map(([name, v]) => {
    const { envs, errors } = getEnvVariables(v.env, env, serviceName)
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
