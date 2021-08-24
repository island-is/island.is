import {
  Service,
  EnvironmentVariables,
  Ingress,
  ServiceDefinition,
  ValueType,
  MissingSetting,
  Resources,
  Hash,
  ExtraValues,
  EnvironmentVariableValue,
  PostgresInfo,
  Feature,
  Features,
} from './types/input-types'
import {
  ContainerEnvironmentVariables,
  ContainerRunHelm,
  ContainerSecrets,
  SerializeMethod,
  ServiceHelm,
} from './types/output-types'
import { EnvironmentConfig, UberChartType } from './types/charts'
import { FeatureNames } from './features'

/**
 * Transforms our definition of a service to a Helm values object
 * @param service Our service definition
 * @param uberChart Uber chart in a specific environment the service will be part of
 */
export const serializeService: SerializeMethod = (
  service: Service,
  uberChart: UberChartType,
) => {
  let allErrors: string[] = []
  const serviceDef = service.serviceDef
  const {
    grantNamespaces,
    grantNamespacesEnabled,
    namespace,
    securityContext,
  } = serviceDef
  const result: ServiceHelm = {
    enabled: true,
    grantNamespaces: grantNamespaces,
    grantNamespacesEnabled: grantNamespacesEnabled,
    namespace: namespace,
    image: {
      repository: `821090935708.dkr.ecr.eu-west-1.amazonaws.com/${
        serviceDef.image ?? serviceDef.name
      }`,
    },
    env: {
      SERVERSIDE_FEATURES_ON: uberChart.env.featuresOn.join(','),
    },
    secrets: {},
    healthCheck: {
      liveness: {
        path: serviceDef.liveness.path,
        initialDelaySeconds: serviceDef.liveness.initialDelaySeconds,
        timeoutSeconds: serviceDef.liveness.timeoutSeconds,
      },
      readiness: {
        path: serviceDef.readiness.path,
        initialDelaySeconds: serviceDef.readiness.initialDelaySeconds,
        timeoutSeconds: serviceDef.readiness.timeoutSeconds,
      },
    },
    securityContext,
  }
  if (uberChart.env.rolloutStrategy) {
    result.strategy = { type: uberChart.env.rolloutStrategy }
  }

  // command and args
  if (serviceDef.cmds) {
    result.command = [serviceDef.cmds]
  }
  if (serviceDef.args) {
    result.args = serviceDef.args
  }

  // resources
  if (serviceDef.resources) {
    result.resources = serviceDef.resources
  }

  // replicas
  if (serviceDef.replicaCount) {
    result.replicaCount = serviceDef.replicaCount
  } else {
    result.replicaCount = {
      min: 2,
      max: uberChart.env.defaultMaxReplicas,
      default: 2,
    }
  }

  // extra attributes
  if (serviceDef.extraAttributes) {
    const { envs, errors } = serializeExtraVariables(
      service,
      uberChart,
      serviceDef.extraAttributes,
    )
    allErrors = allErrors.concat(errors)
    result.extra = envs
  }

  // target port
  if (typeof serviceDef.port !== 'undefined') {
    result.service = { targetPort: serviceDef.port }
  }

  // environment vars
  if (Object.keys(serviceDef.env).length > 0) {
    const { envs, errors } = serializeEnvironmentVariables(
      service,
      uberChart,
      serviceDef.env,
    )
    allErrors = allErrors.concat(errors)
    result.env = { ...result.env, ...envs }
  }

  // secrets
  if (Object.keys(serviceDef.secrets).length > 0) {
    result.secrets = serviceDef.secrets
  }

  addFeaturesConfig(serviceDef.features, uberChart, service, result)

  // service account
  if (serviceDef.serviceAccountEnabled) {
    result.podSecurityContext = {
      fsGroup: 65534,
    }
    const serviceAccountName = serviceDef.accountName ?? serviceDef.name
    result.serviceAccount = {
      create: true,
      name: serviceAccountName,
      annotations: {
        'eks.amazonaws.com/role-arn': `arn:aws:iam::${uberChart.env.awsAccountId}:role/${serviceAccountName}`,
      },
    }
  }

  // initContainers
  if (typeof serviceDef.initContainers !== 'undefined') {
    if (serviceDef.initContainers.containers.length > 0) {
      result.initContainer = {
        containers: serializeContainerRuns(
          serviceDef.initContainers.containers,
        ),
        env: {
          SERVERSIDE_FEATURES_ON: uberChart.env.featuresOn.join(','),
        },
        secrets: {},
      }
      if (typeof serviceDef.initContainers.envs !== 'undefined') {
        const { envs, errors } = serializeEnvironmentVariables(
          service,
          uberChart,
          serviceDef.initContainers.envs,
        )
        allErrors = allErrors.concat(errors)
        result.initContainer.env = { ...result.initContainer.env, ...envs }
      }
      if (typeof serviceDef.initContainers.secrets !== 'undefined') {
        result.initContainer.secrets = serviceDef.initContainers.secrets
      }
      if (serviceDef.initContainers.postgres) {
        const { env, secrets, envErros, secretErrors } = serializePostgres(
          serviceDef,
          uberChart,
          service,
          serviceDef.initContainers.postgres,
        )

        result.initContainer.env = { ...result.initContainer.env, ...env }
        result.initContainer.secrets = {
          ...result.initContainer.secrets,
          ...secrets,
        }
        allErrors = allErrors.concat(envErros)
        allErrors = allErrors.concat(secretErrors)
      }
      if (serviceDef.initContainers.features) {
        addFeaturesConfig(
          serviceDef.initContainers.features!,
          uberChart,
          service,
          result.initContainer!,
        )
      }
    } else {
      allErrors.push('No containers to run defined in initContainers')
    }
  }

  // ingress
  if (Object.keys(serviceDef.ingress).length > 0) {
    result.ingress = Object.entries(serviceDef.ingress).reduce(
      (acc, [ingressName, ingressConf]) => {
        try {
          const ingress = serializeIngress(
            serviceDef,
            ingressConf,
            uberChart.env,
            ingressName,
          )
          return {
            ...acc,
            [`${ingressName}-alb`]: ingress,
          }
        } catch (e) {
          allErrors.push(e.message)
          return acc
        }
      },
      {},
    )
  }

  if (serviceDef.postgres) {
    const { env, secrets, envErros, secretErrors } = serializePostgres(
      serviceDef,
      uberChart,
      service,
      serviceDef.postgres,
    )

    result.env = { ...result.env, ...env }
    result.secrets = { ...result.secrets, ...secrets }
    allErrors = allErrors.concat(envErros)
    allErrors = allErrors.concat(secretErrors)
  }

  return allErrors.length === 0
    ? { type: 'success', serviceDef: result }
    : { type: 'error', errors: allErrors }
}

export const postgresIdentifier = (id: string) => id.replace(/[\W\s]/gi, '_')
export const resolveDbHost = (
  postgres: PostgresInfo,
  uberChart: UberChartType,
  service: Service,
) => {
  if (postgres.host) {
    const resolved = resolveVariable(
      postgres.host?.[uberChart.env.type],
      uberChart,
      service,
    )
    switch (resolved.type) {
      case 'error': {
        throw new Error()
        break
      }
      case 'success': {
        return resolved.value
      }
    }
  } else {
    return uberChart.env.auroraHost
  }
}

function addFeaturesConfig(
  serviceDefFeatures: Partial<Features>,
  uberChart: UberChartType,
  service: Service,
  result: { env: ContainerEnvironmentVariables; secrets: ContainerSecrets },
) {
  const activeFeatures = Object.entries(
    serviceDefFeatures,
  ).filter(([feature]) =>
    uberChart.env.featuresOn.includes(feature as FeatureNames),
  ) as [FeatureNames, Feature][]
  const featureEnvs = activeFeatures.map(([name, v]) => {
    return {
      name,
      vars: serializeEnvironmentVariables(service, uberChart, v.env),
    }
  })
  const featureSecrets = activeFeatures.map(([name, v]) => {
    return {
      name,
      secrets: v.secrets,
    }
  })

  result.env = {
    ...result.env,
    ...featureEnvs.reduce(
      (acc, feature) => ({ ...acc, ...feature.vars.envs }),
      {} as ContainerEnvironmentVariables,
    ),
  }

  result.secrets = {
    ...result.secrets,
    ...featureSecrets.reduce(
      (acc, toggle) => ({ ...acc, ...toggle.secrets }),
      {} as ContainerSecrets,
    ),
  }
}

function serializePostgres(
  serviceDef: ServiceDefinition,
  uberChart: UberChartType,
  service: Service,
  postgres: PostgresInfo,
) {
  const existingEnvVars = ['DB_USER', 'DB_NAME', 'DB_HOST'].filter((v) =>
    Object.keys(serviceDef.env).includes(v),
  )
  const envErros = existingEnvVars.map(
    (v) =>
      `You have already defined an environment variable ${v} which is interfering with the Postgres definion`,
  )
  const existingSecrets = ['DB_PASS'].filter((v) =>
    Object.keys(serviceDef.secrets).includes(v),
  )
  const secretErrors = existingSecrets.map(
    (v) =>
      `You have already defined a secret variable ${v} which is interfering with the Postgres definion`,
  )
  const env: { [name: string]: string } = {}
  const secrets: { [name: string]: string } = {}
  env['DB_USER'] = postgres.username ?? postgresIdentifier(serviceDef.name)
  env['DB_NAME'] = postgres.name ?? postgresIdentifier(serviceDef.name)
  try {
    env['DB_HOST'] = resolveDbHost(postgres, uberChart, service)
  } catch (e) {
    envErros.push(
      `Could not resolve DB_HOST variable for service: ${serviceDef.name}`,
    )
  }
  secrets['DB_PASS'] =
    postgres.passwordSecret ?? `/k8s/${serviceDef.name}/DB_PASSWORD`
  return { env, secrets, envErros, secretErrors }
}

function serializeIngress(
  serviceDef: ServiceDefinition,
  ingressConf: Ingress,
  env: EnvironmentConfig,
  ingressName: string,
) {
  const ingress = ingressConf.host[env.type]
  if (ingress === MissingSetting) {
    throw new Error(
      `Missing ingress host info for service:${serviceDef.name}, ingress:${ingressName} in env:${env.type}`,
    )
  }
  const hosts = (typeof ingress === 'string'
    ? [ingressConf.host[env.type] as string]
    : (ingressConf.host[env.type] as string[])
  ).map((host) =>
    ingressConf.public ?? true
      ? hostFullName(host, env)
      : internalHostFullName(host, env),
  )

  return {
    annotations: {
      'kubernetes.io/ingress.class':
        ingressConf.public ?? true
          ? 'nginx-external-alb'
          : 'nginx-internal-alb',
      ...ingressConf.extraAnnotations?.[env.type],
    },
    hosts: hosts.map((host) => ({
      host: host,
      paths: ingressConf.paths,
    })),
  }
}

function serializeContainerRuns(
  containers: {
    command: string
    args?: string[]
    name?: string
    resources?: Resources
  }[],
): ContainerRunHelm[] {
  return containers.map((c) => {
    let result: ContainerRunHelm = {
      command: [c.command],
      args: c.args,
    }
    if (c.resources) {
      result.resources = c.resources
    }
    if (c.name) {
      result.name = c.name
    }
    return result
  })
}

function serializeValueType(
  value: ValueType,
  uberChart: UberChartType,
  service: Service,
): { type: 'error' } | { type: 'success'; value: string } {
  if (value === MissingSetting) return { type: 'error' }
  const result =
    typeof value === 'string'
      ? value
      : value({
          env: uberChart.env,
          featureName: uberChart.env.feature,
          svc: (dep) => uberChart.ref(service, dep),
        })
  return { type: 'success', value: result }
}

function serializeExtraVariables(
  service: Service,
  uberChart: UberChartType,
  envs: ExtraValues,
): { errors: string[]; envs: Hash } {
  const extraEnvsForType = envs[uberChart.env.type]
  if (extraEnvsForType === MissingSetting) {
    return {
      envs: {},
      errors: [
        `Missing extra setting for service ${service.serviceDef.name} in env ${uberChart.env.type}`,
      ],
    }
  } else {
    return { errors: [], envs: extraEnvsForType }
  }
}

function serializeEnvironmentVariables(
  service: Service,
  uberChart: UberChartType,
  envs: EnvironmentVariables,
): { errors: string[]; envs: { [name: string]: string } } {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      const r = resolveVariable(value, uberChart, service)
      switch (r.type) {
        case 'error':
          return {
            errors: acc.errors.concat([
              `Missing settings for service ${service.serviceDef.name} in env ${uberChart.env.type}. Keys of missing settings: ${name}`,
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
    { errors: [] as string[], envs: {} },
  )
}

const hostFullName = (host: string, env: EnvironmentConfig) => {
  if (host === '') {
    return env.domain
  } else if (host.indexOf('.') < 0) {
    return `${host}.${env.domain}`
  }
  return host
}
const internalHostFullName = (host: string, env: EnvironmentConfig) =>
  host.indexOf('.') < 0 ? `${host}.internal.${env.domain}` : host

function resolveVariable(
  value: EnvironmentVariableValue,
  uberChart: UberChartType,
  service: Service,
) {
  return typeof value === 'object'
    ? serializeValueType(value[uberChart.env.type], uberChart, service)
    : serializeValueType(value, uberChart, service)
}
