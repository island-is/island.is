import {
  EnvironmentVariables,
  ExtraValues,
  Feature,
  Features,
  Hash,
  InfrastructureResource,
  Ingress,
  MissingSetting,
  ReplicaCount,
  Resources,
  Service,
  ServiceDefinition,
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
import { serializeEnvironmentVariables } from './serialize-environment-variables'

function namespaceName(
  namespace: string,
  featureDeployment: string | undefined,
) {
  return featureDeployment ? `feature-${featureDeployment}` : namespace
}

function replicaCount(
  uberChart: UberChartType,
  replicaCount: ReplicaCount | undefined,
  featureDeployment: string | undefined,
) {
  if (replicaCount) return replicaCount
  if (featureDeployment) {
    return {
      min: 1,
      max: 2,
      default: 1,
    }
  } else {
    return {
      min: 2,
      max: uberChart.env.defaultMaxReplicas,
      default: 2,
    }
  }
}

/**
 * Transforms our definition of a service to a Helm values object
 * @param service Our service definition
 * @param uberChart Uber chart in a specific environment the service will be part of
 */
export const serializeService: SerializeMethod = (
  service: Service,
  uberChart: UberChartType,
  featureDeployment?: string,
) => {
  let allErrors: string[] = []
  const checkCollisions = (
    target: { [name: string]: string },
    source: { [name: string]: string },
  ) => {
    const targetKeys = Object.keys(target)
    addToErrors(
      Object.keys(source)
        .filter((srcKey) => targetKeys.includes(srcKey))
        .map((key) => `Collisions for environment or secrets for key ${key}`),
    )
  }
  const mergeObjects = (
    target: { [name: string]: string },
    source: { [name: string]: string },
  ) => {
    checkCollisions(target, source)
    Object.assign(target, source)
  }
  const addToErrors = (errors: string[]) => {
    allErrors.push(...errors)
  }
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
    namespace: namespaceName(namespace, featureDeployment),
    image: {
      repository: `821090935708.dkr.ecr.eu-west-1.amazonaws.com/${
        serviceDef.image ?? serviceDef.name
      }`,
    },
    env: {
      SERVERSIDE_FEATURES_ON: uberChart.env.featuresOn.join(','),
      NODE_OPTIONS: `--max-old-space-size=${
        parseInt(serviceDef.resources.limits.memory, 10) - 48
      }`,
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

  // command and args
  if (serviceDef.cmds) {
    result.command = [serviceDef.cmds]
  }
  if (serviceDef.args) {
    result.args = serviceDef.args
  }

  // resources
  result.resources = serviceDef.resources
  if (serviceDef.env.NODE_OPTIONS) {
    throw new Error(
      'NODE_OPTIONS already set. At the moment of writing, there is no known use case for this, so this might need to be revisited in the future.',
    )
  }

  // replicas
  // if (serviceDef.replicaCount) {
  //   result.replicaCount = serviceDef.replicaCount
  // } else {
  //   result.replicaCount = {
  //     min: 2,
  //     max: uberChart.env.defaultMaxReplicas,
  //     default: 2,
  //   }
  // }
  result.replicaCount = replicaCount(
    uberChart,
    serviceDef.replicaCount,
    featureDeployment,
  )

  // extra attributes
  if (serviceDef.extraAttributes) {
    const { envs, errors } = serializeExtraVariables(
      service,
      uberChart,
      serviceDef.extraAttributes,
    )
    addToErrors(errors)
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
    addToErrors(errors)
    mergeObjects(result.env, envs)
  }

  // secrets
  if (Object.keys(serviceDef.secrets).length > 0) {
    result.secrets = { ...serviceDef.secrets }
  }
  if (Object.keys(serviceDef.files).length > 0) {
    result.files = []
    serviceDef.files.forEach((f) => {
      result.files!.push(f.filename)
      mergeObjects(result.env, { [f.env]: `/etc/config/${f.filename}` })
    })
  }

  const {
    envs: featureEnvs,
    errors: featureErrors,
    secrets: featureSecrets,
  } = addFeaturesConfig(serviceDef.features, uberChart, service)
  mergeObjects(result.env, featureEnvs)
  addToErrors(featureErrors)
  mergeObjects(result.secrets, featureSecrets)

  serviceDef.xroadConfig.forEach((conf) => {
    const { envs, errors } = serializeEnvironmentVariables(
      service,
      uberChart,
      conf.getEnv(),
    )
    addToErrors(errors)
    mergeObjects(result.env, envs)
    mergeObjects(result.secrets, conf.getSecrets())
  })

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
        addToErrors(errors)
        mergeObjects(result.initContainer.env, envs)
      }
      if (typeof serviceDef.initContainers.secrets !== 'undefined') {
        result.initContainer.secrets = serviceDef.initContainers.secrets
      }

      // if (serviceDef.initContainers.postgres) {
      // const { env, secrets, errors } = serializePostgres(
      //   serviceDef,
      //   uberChart,
      //   service,
      //   serviceDef.initContainers.postgres,
      // )
      //
      // mergeObjects(result.initContainer.env, env)
      // mergeObjects(result.initContainer.secrets, secrets)
      // addToErrors(errors)
      // }
      for (const resource of serviceDef.initContainers.infraResource) {
        const { env, secrets, errors } = resource.prodDeploymentConfig(
          serviceDef,
          uberChart,
          service,
          featureDeployment,
        )
        mergeObjects(result.initContainer.env, env)
        mergeObjects(result.initContainer.secrets, secrets)
        addToErrors(errors)
      }

      if (serviceDef.initContainers.features) {
        const {
          envs: featureEnvs,
          errors: featureErrors,
          secrets: featureSecrets,
        } = addFeaturesConfig(
          serviceDef.initContainers.features!,
          uberChart,
          service,
        )

        mergeObjects(result.initContainer.env, featureEnvs)
        addToErrors(featureErrors)
        mergeObjects(result.initContainer.secrets, featureSecrets)
      }
      checkCollisions(result.initContainer.secrets, result.initContainer.env)
    } else {
      addToErrors(['No containers to run defined in initContainers'])
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
            featureDeployment,
          )
          return {
            ...acc,
            [`${ingressName}-alb`]: ingress,
          }
        } catch (e: any) {
          addToErrors([e.message])
          return acc
        }
      },
      {},
    )
  }

  // if (serviceDef.postgres) {
  // const { env, secrets, errors } = serializePostgres(
  //   serviceDef,
  //   uberChart,
  //   service,
  //   serviceDef.postgres,
  // )

  for (const resource of serviceDef.infraResource) {
    const { env, secrets, errors } = resource.prodDeploymentConfig(
      serviceDef,
      uberChart,
      service,
      featureDeployment,
    )
    mergeObjects(result.env, env)
    mergeObjects(result.secrets, secrets)
    addToErrors(errors)
  }
  // }

  checkCollisions(result.secrets, result.env)

  return allErrors.length === 0
    ? { type: 'success', serviceDef: result }
    : { type: 'error', errors: allErrors }
}

function addFeaturesConfig(
  serviceDefFeatures: Partial<Features>,
  uberChart: UberChartType,
  service: Service,
) {
  const activeFeatures = Object.entries(
    serviceDefFeatures,
  ).filter(([feature]) =>
    uberChart.env.featuresOn.includes(feature as FeatureNames),
  ) as [FeatureNames, Feature][]
  const featureEnvs = activeFeatures.map(([name, v]) => {
    const { envs, errors } = serializeEnvironmentVariables(
      service,
      uberChart,
      v.env,
    )
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
      {} as ContainerEnvironmentVariables,
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

function serializeIngress(
  serviceDef: ServiceDefinition,
  ingressConf: Ingress,
  env: EnvironmentConfig,
  ingressName: string,
  featureDeployment?: string,
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
  )
    .map((host) =>
      ingressConf.public ?? true
        ? hostFullName(host, env)
        : internalHostFullName(host, env),
    )
    .map((host) => {
      if (env.type === 'dev' && featureDeployment) {
        return `${featureDeployment}-${host}`
      }
      return host
    })

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
      resources: {
        limits: {
          memory: '256Mi',
          cpu: '200m',
        },
        requests: {
          memory: '128Mi',
          cpu: '100m',
        },
      },
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
