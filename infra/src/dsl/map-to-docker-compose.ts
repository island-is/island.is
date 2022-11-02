import {
  AccessModes,
  EnvironmentVariables,
  EnvironmentVariableValue,
  ExtraValues,
  Feature,
  Features,
  Hash,
  Ingress,
  MissingSetting,
  PostgresInfo,
  Resources,
  Secrets,
  Service,
  ServiceDefinition,
  ValueType,
} from './types/input-types'
import {
  ContainerEnvironmentVariables,
  ContainerRunHelm,
  ContainerSecrets,
  DockerComposeService,
  OutputFormat,
  OutputPersistentVolumeClaim,
  SerializeErrors,
  SerializeMethod,
  SerializeSuccess,
  ServiceOutputType,
} from './types/output-types'
import { EnvironmentConfig, DeploymentRuntime } from './types/charts'
import { FeatureNames } from './features'
import { SSM } from '@aws-sdk/client-ssm'
import { ServerSideFeature } from '../../../libs/feature-flags/src'

/**
 * Transforms our definition of a service to a Helm values object
 * @param service Our service definition
 * @param deployment Uber chart in a specific environment the service will be part of
 */
export const serializeService: SerializeMethod<DockerComposeService> = (
  service: Service,
  deployment: DeploymentRuntime,
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
        .map(
          (key) =>
            `Collisions in ${service.serviceDef.name} for environment or secrets for key ${key}`,
        ),
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

  // extra attributes
  // if (serviceDef.extraAttributes) {
  //   const { envs, errors } = serializeExtraVariables(
  //     service,
  //     deployment,
  //     serviceDef.extraAttributes,
  //   )
  //   addToErrors(errors)
  //   result.extra = envs
  // }

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

  const {
    envs: featureEnvs,
    errors: featureErrors,
    secrets: featureSecrets,
  } = addFeaturesConfig(serviceDef.features, deployment, service)
  mergeObjects(result.env, featureEnvs)
  addToErrors(featureErrors)
  mergeObjects(secrets, featureSecrets)

  serviceDef.xroadConfig.forEach((conf) => {
    const { envs, errors } = serializeEnvironmentVariables(
      service,
      deployment,
      conf.getEnv(),
    )
    addToErrors(errors)
    mergeObjects(result.env, envs)
    mergeObjects(secrets, conf.getSecrets())
  })

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
      if (serviceDef.initContainers.features) {
        const {
          envs: featureEnvs,
          errors: featureErrors,
          secrets: featureSecrets,
        } = addFeaturesConfig(
          serviceDef.initContainers.features!,
          deployment,
          service,
        )

        Object.values(initContainers).forEach((initContainer) =>
          mergeObjects(initContainer.env, featureEnvs),
        )
        addToErrors(featureErrors)
        // mergeObjects(result.initContainer.secrets, featureSecrets)
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

  return allErrors.length === 0
    ? { type: 'success', serviceDef: [result] }
    : { type: 'error', errors: allErrors }
}

export const postgresIdentifier = (id: string) => id.replace(/[\W\s]/gi, '_')
export const resolveDbHost = (
  postgres: PostgresInfo,
  deployment: DeploymentRuntime,
  service: Service,
) => {
  if (postgres.host) {
    const resolved = resolveVariable(
      postgres.host?.[deployment.env.type],
      deployment,
      service,
    )
    switch (resolved.type) {
      case 'error': {
        throw new Error()
        break
      }
      case 'success': {
        return { writer: resolved.value, reader: resolved.value }
      }
    }
  } else {
    return {
      writer: deployment.env.auroraHost,
      reader: deployment.env.auroraReplica ?? deployment.env.auroraHost,
    }
  }
}

function addFeaturesConfig(
  serviceDefFeatures: Partial<Features>,
  deployment: DeploymentRuntime,
  service: Service,
) {
  const activeFeatures = Object.entries(
    serviceDefFeatures,
  ).filter(([feature]) =>
    deployment.env.featuresOn.includes(feature as FeatureNames),
  ) as [FeatureNames, Feature][]
  const featureEnvs = activeFeatures.map(([name, v]) => {
    const { envs, errors } = serializeEnvironmentVariables(
      service,
      deployment,
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

function serializePostgres(
  serviceDef: ServiceDefinition,
  deployment: DeploymentRuntime,
  service: Service,
  postgres: PostgresInfo,
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

function serializeIngress(
  serviceDef: ServiceDefinition,
  ingressConf: Ingress,
  env: EnvironmentConfig,
  ingressName: string,
) {
  const ingress = ingressConf.host[env.type]
  if (ingress === MissingSetting) {
    return
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

function serializeVolumes(
  service: Service,
  volumes: {
    name?: string
    size: string
    accessModes: AccessModes
    mountPath: string
    storageClass?: string
  }[],
) {
  const errors: string[] = []
  const mapping: {
    [mode in AccessModes]: OutputPersistentVolumeClaim['accessModes']
  } = {
    ReadOnly: 'ReadOnlyMany',
    ReadWrite: 'ReadWriteMany',
  }
  if (volumes.some((v) => typeof v.name === undefined) && volumes.length > 1) {
    return { errors: ['Must set volume name if more than one'], volumes: [] }
  }

  const results: OutputPersistentVolumeClaim[] = volumes.map((volume) => ({
    name: volume.name ?? `${service.serviceDef.name}`,
    size: volume.size,
    mountPath: volume.mountPath,
    storageClass: 'efs-csi',
    accessModes: mapping[volume.accessModes],
  }))

  return { errors, volumes: results }
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

function serializeValueType(
  value: ValueType,
  deployment: DeploymentRuntime,
  service: Service,
): { type: 'error' } | { type: 'success'; value: string } {
  if (value === MissingSetting) return { type: 'error' }
  const result =
    typeof value === 'string'
      ? value
      : value({
          env: deployment.env,
          featureDeploymentName: deployment.env.feature,
          svc: (dep) => deployment.ref(service, dep),
        })
  return { type: 'success', value: result }
}

function serializeExtraVariables(
  service: Service,
  deployment: DeploymentRuntime,
  envs: ExtraValues,
): { errors: string[]; envs: Hash } {
  const extraEnvsForType = envs[deployment.env.type]
  if (extraEnvsForType === MissingSetting) {
    return {
      envs: {},
      errors: [
        `Missing extra setting for service ${service.serviceDef.name} in env ${deployment.env.type}`,
      ],
    }
  } else {
    return { errors: [], envs: extraEnvsForType }
  }
}

function serializeEnvironmentVariables(
  service: Service,
  deployment: DeploymentRuntime,
  envs: EnvironmentVariables,
): { errors: string[]; envs: ContainerEnvironmentVariables } {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      console.log(`Resolving ${name}`)
      const r = resolveVariable(value, deployment, service)
      switch (r.type) {
        case 'error':
          return {
            errors: acc.errors.concat([
              `Missing settings for service ${service.serviceDef.name} in env ${deployment.env.type}. Keys of missing settings: ${name}`,
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
    { errors: [] as string[], envs: {} as ContainerEnvironmentVariables },
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
  deployment: DeploymentRuntime,
  service: Service,
) {
  return typeof value === 'object'
    ? serializeValueType(value[deployment.env.type], deployment, service)
    : serializeValueType(value, deployment, service)
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
