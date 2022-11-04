import {
  AccessModes,
  EnvironmentVariablesForEnv,
  IngressForEnv,
  MissingSetting,
  PostgresInfoForEnv,
  Resources,
  Service,
  ServiceDefinitionForEnv,
  ValueType,
} from './types/input-types'
import {
  ContainerEnvironmentVariables,
  ContainerRunHelm,
  OutputFormat,
  OutputPersistentVolumeClaim,
  SerializeErrors,
  SerializeMethod,
  SerializeSuccess,
  ServiceHelm,
} from './types/output-types'
import { DeploymentRuntime, EnvironmentConfig } from './types/charts'
import { ServerSideFeature } from '../../../libs/feature-flags/src'
import { processService } from './pre-process-service'

/**
 * Transforms our definition of a service to a Helm values object
 * @param service Our service definition
 * @param deployment Uber chart in a specific environment the service will be part of
 */
export const serializeService: SerializeMethod<ServiceHelm> = (
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
  const processedService = processService(service, deployment.env)
  if (processedService.type === 'success') {
    const serviceDef = processedService.serviceDef
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
        SERVERSIDE_FEATURES_ON: deployment.env.featuresOn.join(','),
        NODE_OPTIONS: `--max-old-space-size=${
          parseInt(serviceDef.resources.limits.memory, 10) - 48
        }`,
      },
      secrets: {},
      healthCheck: {
        port: serviceDef.healthPort,
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
    if (serviceDef.replicaCount) {
      result.replicaCount = {
        min: serviceDef.replicaCount.min,
        max: serviceDef.replicaCount.max,
        default: serviceDef.replicaCount.default,
      }
    } else {
      result.replicaCount = {
        min: deployment.env.defaultMinReplicas,
        max: deployment.env.defaultMaxReplicas,
        default: deployment.env.defaultMinReplicas,
      }
    }

    result.hpa = {
      scaling: {
        replicas: {
          min: result.replicaCount.min,
          max: result.replicaCount.max,
        },
        metric: {
          cpuAverageUtilization: 70,
        },
      },
    }
    result.hpa.scaling.metric.nginxRequestsIrate =
      serviceDef.replicaCount?.scalingMagicNumber || 2

    if (
      serviceDef.extraAttributes &&
      serviceDef.extraAttributes !== MissingSetting
    ) {
      result.extra = serviceDef.extraAttributes
    }
    // target port
    if (typeof serviceDef.port !== 'undefined') {
      result.service = { targetPort: serviceDef.port }
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
          'eks.amazonaws.com/role-arn': `arn:aws:iam::${deployment.env.awsAccountId}:role/${serviceAccountName}`,
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
            SERVERSIDE_FEATURES_ON: deployment.env.featuresOn.join(','),
          },
          secrets: {},
        }
        if (typeof serviceDef.initContainers.envs !== 'undefined') {
          const { envs, errors } = serializeEnvironmentVariables(
            service,
            deployment,
            serviceDef.initContainers.envs,
          )
          addToErrors(errors)
          mergeObjects(result.initContainer.env, envs)
        }
        if (typeof serviceDef.initContainers.secrets !== 'undefined') {
          result.initContainer.secrets = serviceDef.initContainers.secrets
        }
        if (serviceDef.initContainers.postgres) {
          const { env, secrets, errors } = serializePostgres(
            serviceDef,
            deployment,
            service,
            serviceDef.initContainers.postgres,
          )

          mergeObjects(result.initContainer.env, env)
          mergeObjects(result.initContainer.secrets, secrets)
          addToErrors(errors)
        }
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
              deployment.env,
              ingressName,
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

    if (serviceDef.postgres) {
      const { env, secrets, errors } = serializePostgres(
        serviceDef,
        deployment,
        service,
        serviceDef.postgres,
      )

      mergeObjects(result.env, env)
      mergeObjects(result.secrets, secrets)
      addToErrors(errors)
    }

    // Volumes
    if (Object.keys(serviceDef.volumes.length > 0)) {
      const { errors, volumes } = serializeVolumes(service, serviceDef.volumes)
      addToErrors(errors)
      result.pvcs = volumes
    }
    checkCollisions(result.secrets, result.env)

    return allErrors.length === 0
      ? { type: 'success', serviceDef: [result] }
      : { type: 'error', errors: allErrors }
  } else {
    return { type: 'error', errors: processedService.errors }
  }
}

export const postgresIdentifier = (id: string) => id.replace(/[\W\s]/gi, '_')
export const resolveDbHost = (
  postgres: PostgresInfoForEnv,
  deployment: DeploymentRuntime,
  service: Service,
) => {
  if (postgres.host) {
    const resolved = serializeValueType(postgres.host, deployment, service)
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

function serializeIngress(
  serviceDef: ServiceDefinitionForEnv,
  ingressConf: IngressForEnv,
  env: EnvironmentConfig,
  ingressName: string,
) {
  if (ingressConf.host === MissingSetting) {
    return
  }
  const hosts = (typeof ingressConf.host === 'string'
    ? [ingressConf.host]
    : ingressConf.host
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
      ...ingressConf.extraAnnotations,
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

function serializeEnvironmentVariables(
  service: Service,
  deployment: DeploymentRuntime,
  envs: EnvironmentVariablesForEnv,
): { errors: string[]; envs: ContainerEnvironmentVariables } {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      const r = serializeValueType(value, deployment, service)
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

export const serviceMockDef = (options: {
  namespace: string
  target: string
}) => {
  const result: ServiceHelm = {
    enabled: true,
    grantNamespaces: [],
    grantNamespacesEnabled: false,
    namespace: options.namespace,
    image: {
      repository: `wiremock`,
    },
    env: {},
    command: ['mock'],
    secrets: {},
    healthCheck: {
      port: 8000,
      liveness: {
        path: '/',
        initialDelaySeconds: 5,
        timeoutSeconds: 5,
      },
      readiness: {
        path: '/',
        initialDelaySeconds: 5,
        timeoutSeconds: 5,
      },
    },
    securityContext: {
      privileged: false,
      allowPrivilegeEscalation: false,
    },
  }
  return result
}

export const HelmOutput: OutputFormat<ServiceHelm> = {
  serializeService(
    service: Service,
    deployment: DeploymentRuntime,
    featuresOn?: ServerSideFeature[],
  ): SerializeSuccess<ServiceHelm> | SerializeErrors {
    return serializeService(service, deployment)
  },

  serviceMockDef(options: { namespace: string; target: string }): ServiceHelm {
    return serviceMockDef(options)
  },
}
