import {
  AccessModes,
  IngressForEnv,
  PostgresInfo,
  PostgresInfoForEnv,
  Resources,
  ServiceDefinition,
  ServiceDefinitionForEnv,
} from '../types/input-types'
import {
  ContainerRunHelm,
  OutputFormat,
  OutputVolumeMountNative,
  SerializeErrors,
  SerializeMethod,
  SerializeSuccess,
  KubeService,
} from '../types/output-types'
import { ReferenceResolver, EnvironmentConfig } from '../types/charts'
import { checksAndValidations } from './errors'
import {
  postgresIdentifier,
  resolveWithMaxLength,
  serializeKubeEnvs,
  serializeKubeSecrets,
  serializeEnvironmentVariables,
} from './serialization-helpers'

/**
 * Transforms our definition of a service to a Helm values object
 * @param service Our service definition
 * @param deployment Uber chart in a specific environment the service will be part of
 */
const serializeService: SerializeMethod<KubeService> = async (
  service: ServiceDefinitionForEnv,
  deployment: ReferenceResolver,
  opsenv: EnvironmentConfig,
) => {
  const { mergeObjects, addToErrors, getErrors } = checksAndValidations(
    service.name,
  )
  const serviceDef = service
  const { namespace } = serviceDef
  const result: KubeService = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: service.name,
      namespace: namespace,
    },
    labels: {
      'tags.datadoghq.com/env': opsenv.type,
      'tags.datadoghq.com/service': service.name,
      'tags.datadoghq.com/version': `821090935708.dkr.ecr.eu-west-1.amazonaws.com/${
        service.image ?? service.name
      }`,
    },
    spec: {
      strategy: {
        type: 'RollingUpdate',
        rollingUpdate: {
          maxSurge: '25%',
          maxUnavailable: '25%',
        },
      },
      template: {
        metadata: {
          labels: {
            'tags.datadoghq.com/env': opsenv.type,
            'tags.datadoghq.com/service': service.name,
            'tags.datadoghq.com/version': `821090935708.dkr.ecr.eu-west-1.amazonaws.com/${
              service.image ?? service.name
            }`,
          },
          annotations: {
            [`ad.datadoghq.com/${service.name}.logs`]: `[{
              "log_processing_rules": [{
                "type": "mask_sequences", 
                "name": "mask_national_ids", 
                "replace_placeholder": "--MASKED--", 
                "pattern" : "\\b(?:[89]\\d{3}|(?:[012]\\d|3[01])(?:0\\d|1[012]))\\d\\d-?\\d{4}\\b"
              }]
            }]`,
          },
        },
      },
      spec: {
        containers: {
          env: [],
          name: service.name,
          securityContext: service.securityContext,
          image: `821090935708.dkr.ecr.eu-west-1.amazonaws.com/${
            service.image ?? service.name
          }`,
          imagePullPolicy: 'IfNotPresent',
          livenessProbe: {
            httpGet: {
              path: service.liveness.path,
              port: service.healthPort,
            },
            initialDelaySeconds: service.liveness.initialDelaySeconds,
            timeoutSeconds: service.liveness.timeoutSeconds,
          },
          readinessProbe: {
            httpGet: {
              path: service.readiness.path,
              port: service.healthPort,
            },
            initialDelaySeconds: service.readiness.initialDelaySeconds,
            timeoutSeconds: service.readiness.timeoutSeconds,
          },
          resources: service.resources,
        },
      },
    },
  }

  // command and args
  if (serviceDef.cmds) {
    result.spec.spec.containers.command = [serviceDef.cmds]
  }
  if (serviceDef.args) {
    result.spec.spec.containers.args = serviceDef.args
  }

  // environment vars
  if (Object.keys(serviceDef.env).length > 0) {
    const { envs } = serializeEnvironmentVariables(
      service,
      deployment,
      serviceDef.env,
      opsenv,
    )
    Object.assign(
      result.spec.spec.containers.env,
      serializeKubeEnvs(envs).value,
    )
  }
  if (Object.keys(serviceDef.secrets).length > 0) {
    Object.assign(
      result.spec.spec.containers.env,
      serializeKubeSecrets(service.secrets).value,
    )
  }

  if (Object.keys(serviceDef.files).length > 0) {
    serviceDef.files.forEach((f) => {
      result.spec.spec.containers.volumeMounts = []
      result.spec.spec.containers.volumeMounts.push({
        name: f.filename,
        mountPath: `/etc/config/${f.filename}`,
      })
    })
  }

  // service account
  if (serviceDef.serviceAccountEnabled) {
    result.spec.spec.containers.securityContext = {
      allowPrivilegeEscalation: false,
      privileged: false,
      fsGroup: 65534,
    }
    const serviceAccountName = serviceDef.accountName ?? serviceDef.name
    result.spec.spec.serviceAccountName = serviceAccountName
  }

  // initContainers
  if (typeof serviceDef.initContainers !== 'undefined') {
    result.spec.spec.initContainers = []
    if (typeof serviceDef.initContainers.secrets !== 'undefined') {
      result.spec.spec.initContainers.forEach((c) => {
        if (serviceDef.initContainers)
          c.env = serializeKubeSecrets(serviceDef.initContainers.secrets).value
      })

      serializeKubeSecrets(serviceDef.initContainers.secrets)
      Object.entries(serviceDef.initContainers.secrets).forEach(
        ([key, value]) => {
          result.spec.spec.initContainers?.forEach((c) => {
            c.env.push({
              name: key,
              valueFrom: {
                secretKeyRef: {
                  name: key,
                  key: value,
                },
              },
            })
          })
        },
      )
    }
    if (serviceDef.initContainers.containers.length > 0) {
      const { envs } = serializeEnvironmentVariables(
        service,
        deployment,
        serviceDef.initContainers.envs,
        opsenv,
      )
      serviceDef.initContainers.containers.forEach((c) => {
        const legacyCommand = []
        legacyCommand.push(c.command)
        if (result.spec.spec.initContainers) {
          result.spec.spec.initContainers.push({
            args: c.args,
            command: legacyCommand,
            name: c.name,
            image: '',
            env: serializeKubeEnvs(envs).value,
          })
        }
      })
    }
    if (Object.keys(serviceDef.volumes.length > 0)) {
      serviceDef.volumes.forEach((v) => {
        result.spec.spec.containers.volumes?.push({
          name: v.name ? v.name : service.name,
          persistentVolumeClaim: {
            claimName: v.name ? v.name : service.name,
          },
        })
        result.spec.spec.containers.volumeMounts?.push({
          name: v.name ? v.name : service.name,
          mountPath: v.mountPath,
        })
      })
    }
    if (serviceDef.initContainers.postgres) {
      const { env, secrets, errors } = serializePostgres(
        serviceDef,
        deployment,
        opsenv,
        service,
        serviceDef.initContainers.postgres,
      )
      Object.assign(
        result.spec.spec.containers.env,
        serializeKubeEnvs(env).value,
      )

      Object.assign(
        result.spec.spec.containers.env,
        serializeKubeSecrets(secrets).value,
      )
      addToErrors(errors)
    }
    function serializePostgres(
      serviceDef: ServiceDefinitionForEnv,
      deployment: ReferenceResolver,
      envConf: EnvironmentConfig,
      service: ServiceDefinitionForEnv,
      postgres: PostgresInfoForEnv,
    ) {
      const env: { [name: string]: string } = {}
      const secrets: { [name: string]: string } = {}
      const errors: string[] = []
      env['DB_USER'] = postgres.username ?? postgresIdentifier(serviceDef.name)
      env['DB_NAME'] = postgres.name ?? postgresIdentifier(serviceDef.name)
      try {
        const { reader, writer } = resolveDbHost(
          service,
          envConf,
          postgres.host,
        )
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
  }
  const allErrors = getErrors()
  return allErrors.length === 0
    ? { type: 'success', serviceDef: [result] }
    : { type: 'error', errors: allErrors }
}

export const KubeOutput: OutputFormat<KubeService> = {
  serializeService(
    service: ServiceDefinitionForEnv,
    deployment: ReferenceResolver,
    env: EnvironmentConfig,
  ): Promise<SerializeSuccess<KubeService> | SerializeErrors> {
    return serializeService(service, deployment, env)
  },
  featureDeployment(options): KubeService {
    throw new Error('Not used')
  },
  serviceMockDef(options): KubeService {
    throw new Error('Not used')
  },
}
export const resolveDbHost = (
  service: ServiceDefinitionForEnv,
  env: EnvironmentConfig,
  host?: string,
) => {
  if (host) {
    return { writer: host, reader: host }
  } else {
    return {
      writer: env.auroraHost,
      reader: env.auroraReplica ?? env.auroraHost,
    }
  }
}
/*
      if (serviceDef.initContainers.postgres) {
        const { env, secrets, errors } = serializePostgres(
          serviceDef,
          deployment,
          opsenv,
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
        const ingress = serializeIngress(serviceDef, ingressConf, opsenv)
        return {
          ...acc,
          [`${ingressName}-alb`]: ingress,
        }
      },
      {},
    )
  }

  if (serviceDef.postgres) {
    const { env, secrets, errors } = serializePostgres(
      serviceDef,
      deployment,
      opsenv,
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

  const allErrors = getErrors()
  return allErrors.length === 0
    ? { type: 'success', serviceDef: [result] }
    : { type: 'error', errors: allErrors }
}

export const resolveDbHost = (
  service: ServiceDefinitionForEnv,
  env: EnvironmentConfig,
  host?: string,
) => {
  if (host) {
    return { writer: host, reader: host }
  } else {
    return {
      writer: env.auroraHost,
      reader: env.auroraReplica ?? env.auroraHost,
    }
  }
}

const getPostgresInfoForFeature = (feature: string, postgres: PostgresInfo) => {
  const postgresCopy = { ...postgres }
  postgresCopy.passwordSecret = postgres.passwordSecret?.replace(
    '/k8s/',
    `/k8s/feature-${feature}-`,
  )
  postgresCopy.name = resolveWithMaxLength(
    `feature_${postgresIdentifier(feature)}_${postgres.name}`,
    60,
  )
  postgresCopy.username = resolveWithMaxLength(
    `feature_${postgresIdentifier(feature)}_${postgres.username}`,
    60,
  )
  return postgresCopy
}

function serializePostgres(
  serviceDef: ServiceDefinitionForEnv,
  deployment: ReferenceResolver,
  envConf: EnvironmentConfig,
  service: ServiceDefinitionForEnv,
  postgres: PostgresInfoForEnv,
) {
  const env: { [name: string]: string } = {}
  const secrets: { [name: string]: string } = {}
  const errors: string[] = []
  env['DB_USER'] = postgres.username ?? postgresIdentifier(serviceDef.name)
  env['DB_NAME'] = postgres.name ?? postgresIdentifier(serviceDef.name)
  try {
    const { reader, writer } = resolveDbHost(service, envConf, postgres.host)
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
) {
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
  service: ServiceDefinitionForEnv,
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
    [mode in AccessModes]: OutputPersistentVolumeClaimHelm['accessModes']
  } = {
    ReadOnly: 'ReadOnlyMany',
    ReadWrite: 'ReadWriteMany',
  }
  if (volumes.some((v) => typeof v.name === undefined) && volumes.length > 1) {
    return { errors: ['Must set volume name if more than one'], volumes: [] }
  }

  const results: OutputPersistentVolumeClaimHelm[] = volumes.map((volume) => ({
    name: volume.name ?? `${service.name}`,
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

const serviceMockDef = (options: {
  runtime: ReferenceResolver
  env: EnvironmentConfig
}) => {
  const result: HelmService = {
    enabled: true,
    grantNamespaces: [],
    grantNamespacesEnabled: false,
    namespace: getFeatureDeploymentNamespace(options.env),
    image: {
      repository: `bbyars/mountebank`,
    },
    env: {},
    command: ['mb', 'start', '--configfile=/etc/config/default-imposters.json'],
    secrets: {},
    service: {
      targetPort: 2525,
    },
    files: ['default-imposters.json'],
    healthCheck: {
      port: 2525,
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
    replicaCount: {
      min: 1,
      max: 1,
      default: 1,
    },
    securityContext: {
      privileged: false,
      allowPrivilegeEscalation: false,
    },
  }
  return result
}

function getFeatureDeploymentNamespace(env: EnvironmentConfig) {
  return `feature-${env.feature}`
}

export const HelmOutput: OutputFormat<HelmService> = {
  featureDeployment(s: ServiceDefinition, env): void {
    Object.entries(s.ingress).forEach(([name, ingress]) => {
      if (!Array.isArray(ingress.host.dev)) {
        ingress.host.dev = [ingress.host.dev]
      }
      ingress.host.dev = ingress.host.dev.map(
        (host) => `${env.feature}-${host}`,
      )
    })
    s.replicaCount = {
      min: Math.min(1, s.replicaCount?.min ?? 1),
      max: Math.min(2, s.replicaCount?.max ?? 2),
      default: Math.min(1, s.replicaCount?.default ?? 1),
    }
    s.namespace = getFeatureDeploymentNamespace(env)
    if (s.postgres) {
      s.postgres = getPostgresInfoForFeature(env.feature!, s.postgres)
    }
    if (s.initContainers?.postgres) {
      s.initContainers.postgres = getPostgresInfoForFeature(
        env.feature!,
        s.initContainers.postgres,
      )
    }
  },
  serializeService(
    service: ServiceDefinitionForEnv,
    deployment: ReferenceResolver,
    env: EnvironmentConfig,
    featureDeployment?: string,
  ): Promise<SerializeSuccess<HelmService> | SerializeErrors> {
    return serializeService(service, deployment, env)
  },

  serviceMockDef(options): HelmService {
    return serviceMockDef(options)
  },
}
*/
