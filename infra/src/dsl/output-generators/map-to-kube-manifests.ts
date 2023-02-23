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
  ContainerEnvironmentVariablesOrSecretsKube,
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

  if (
    Object.keys(serviceDef.secrets).length > 0 ||
    Object.keys(serviceDef.env).length > 0
  ) {
    const { envs } = serializeEnvironmentVariables(
      service,
      deployment,
      serviceDef.env,
      opsenv,
    )
    result.spec.spec.containers.env.push(
      ...serializeKubeEnvs(envs).value,
      ...serializeKubeSecrets(service.secrets).value,
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

  // Postgres
  if (serviceDef.postgres) {
    const { env, secrets, errors } = serializePostgres(
      serviceDef,
      deployment,
      opsenv,
      service,
      serviceDef.postgres,
    )
    result.spec.spec.containers.env.push(
      ...(serializeKubeEnvs(env).value || {}),
      ...(serializeKubeSecrets(secrets).value || {}),
    )
    addToErrors(errors)
  }
  // Volumes
  if (Object.keys(serviceDef.volumes).length > 0) {
    serviceDef.volumes.forEach((v) => {
      result.spec.spec.containers.volumeMounts?.push({
        name: v.name ? v.name : service.name,
        mountPath: v.mountPath,
      })
      result.spec.volumes = []
      result.spec.volumes.push({
        name: v.name ? v.name : service.name,
        persistentVolumeClaim: {
          claimName: v.name ? v.name : service.name,
        },
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
          c.env.push(
            ...serializeKubeSecrets(serviceDef.initContainers.secrets).value,
          )
      })
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
        const envsAndSecrets = serializeKubeEnvs(envs).value.concat(
          serializeKubeSecrets(serviceDef.initContainers?.secrets ?? {}).value,
        )
        legacyCommand.push(c.command)
        if (result.spec.spec.initContainers) {
          result.spec.spec.initContainers.push({
            args: c.args,
            command: legacyCommand,
            name: c.name,
            image: '',
            env: envsAndSecrets,
          })
        }
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
      result.spec.spec.initContainers.forEach((c) => {
        c.env.push(
          ...serializeKubeEnvs(env).value,
          ...serializeKubeSecrets(secrets).value,
        )
      })
      addToErrors(errors)
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
