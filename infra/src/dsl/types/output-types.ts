import { Hash, ServiceDefinition, ServiceDefinitionForEnv } from './input-types'
import { ReferenceResolver, EnvironmentConfig } from './charts'
import { metadataKey } from 'aws-sdk/clients/health'
import { string } from 'yargs'

// Output types
export type ContainerRunHelm = {
  command: string[]
  args?: string[]
  name?: string
  resources: {
    limits: {
      cpu: string
      memory: string
    }
    requests: {
      cpu: string
      memory: string
    }
  }
}
export type OutputAccessModes = 'ReadWriteMany' | 'ReadOnlyMany'
export type OutputPersistentVolumeClaimHelm = {
  name?: string
  size: string
  accessModes: OutputAccessModes
  mountPath: string
  /**
   * Sets the storageClass, leave empty if storageClass means little to you(defaults to efs-csi),
   * Mostly for internal use by the DevOps team.
   */
  storageClass: 'efs-csi'
}

export type OutputVolumeMountNative = {
  name: string
  mountPath: string
}
export type ContainerEnvironmentVariables = { [name: string]: string }
export type ContainerEnvironmentVariablesOrSecrets = {
  [name: string]:
    | string
    | { valueFrom: { secretKeyRef: { name: string; key: string } } }
}
export type ContainerSecrets = { [name: string]: string }
export type SecurityContext = {
  allowPrivilegeEscalation: boolean
  privileged: boolean
}
export interface KubeService {
  apiVersion?: 'apps/v1'
  kind?: 'Deployment'
  metadata: {
    name: string
    namespace: string
  }
  labels: {
    [name: string]: string
  }
  spec: {
    replicas?: number
    strategy: {
      type: 'Recreate' | 'RollingUpdate'
      rollingUpdate?: { maxSurge: string; maxUnavailable: string }
    }
    selector?: {
      matchLabels: string
    }
    template: {
      metadata: {
        labels: {
          [name: string]: string
        }
        annotations: {
          [name: string]: string
        }
      }
    }
    spec: {
      imagePullSecrets?: string
      securityContext?: SecurityContext
      serviceAccountName?: string
      initContainers?: {
        name: string
        securityContext?: string
        image: string
        command?: string[]
        args?: string[]
        env: ContainerEnvironmentVariablesOrSecrets
        resources?: {
          limits?: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
      }
      containers: {
        name: string
        securityContext?: SecurityContext
        image: string
        imagePullPolicy: 'IfNotPresent' | 'Always' | 'Never'
        command?: string[]
        args?: string[]
        livenessProbe: {
          httpGet: {
            path: string
            port?: number
          }
          initialDelaySeconds: number
          timeoutSeconds: number
        }
        readinessProbe: {
          httpGet: {
            path: string
            port?: number
          }
          initialDelaySeconds: number
          timeoutSeconds: number
        }
        env: ContainerEnvironmentVariablesOrSecrets
        resources?: {
          limits?: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        volumeMounts?: OutputVolumeMountNative[]
        nodeSelector?: { [name: string]: string }
        affinity?: { [name: string]: string }
        tolerations?: { [name: string]: string }
        volumes?: {
          name: string
          persistentVolumeClaim?: {
            claimName: string
          }
        }[]
      }
    }
  }
}

export interface HelmService {
  replicaCount?: {
    min: number
    max: number
    default: number
  }

  hpa?: {
    scaling: {
      replicas: {
        min: number
        max: number
      }
      metric: { nginxRequestsIrate?: number; cpuAverageUtilization: number }
    }
  }

  healthCheck: {
    port?: number
    liveness: {
      path: string
      initialDelaySeconds: number
      timeoutSeconds: number
    }
    readiness: {
      path: string
      initialDelaySeconds: number
      timeoutSeconds: number
    }
  }

  serviceAccount?: {
    create: boolean
    name: string
    annotations: {
      'eks.amazonaws.com/role-arn': string
    }
  }

  service?: {
    targetPort: number
  }

  podSecurityContext?: {
    fsGroup: 65534
  }

  securityContext: {
    privileged?: boolean
    allowPrivilegeEscalation?: boolean
  }

  ingress?: {
    [name: string]: {
      annotations: {
        [anntName: string]: string
      }
      hosts: { host: string; paths: string[] }[]
    }
  }

  initContainer?: {
    secrets: ContainerSecrets
    env: ContainerEnvironmentVariables
    containers: ContainerRunHelm[]
  }

  command?: string[]
  args?: string[]
  resources?: {
    limits?: {
      cpu: string
      memory: string
    }
    requests: {
      cpu: string
      memory: string
    }
  }
  pvcs?: OutputPersistentVolumeClaimHelm[]
  grantNamespaces: string[]
  grantNamespacesEnabled: boolean

  env: ContainerEnvironmentVariables
  secrets: ContainerSecrets
  enabled: boolean
  namespace: string
  image: {
    repository: string
  }
  extra?: Hash
  files?: string[]
}

export interface LocalrunService {
  env: ContainerEnvironmentVariables
  command?: string[]
  port?: number
}

export interface FeatureKubeJob {
  apiVersion: 'batch/v1'
  kind: 'Job'
  metadata: { name: string; labels?: { [name: string]: string } }
  spec: {
    template: {
      spec: {
        serviceAccountName: 'feature-deployment'
        containers: {
          command: string[]
          image: string
          name: string
          env: { name: string; value: string }[]
        }[]
        restartPolicy: 'Never' | 'OnFailure'
      }
    }
  }
}

export type SerializeSuccess<T> = {
  type: 'success'
  serviceDef: T[]
}

export type SerializeErrors = {
  type: 'error'
  errors: string[]
}

export type ServiceOutputType = HelmService | LocalrunService | KubeService

export type SerializeMethod<T extends ServiceOutputType> = (
  service: ServiceDefinitionForEnv,
  runtime: ReferenceResolver,
  env: EnvironmentConfig,
  featureDeployment?: string,
) => Promise<SerializeSuccess<T> | SerializeErrors>

export type Services<T extends ServiceOutputType> = {
  [name: string]: T
}

export type HelmValueFile = {
  namespaces: string[]
  services: Services<HelmService>
}

export type KubeValueFile = {
  namespaces: string[]
  services: Services<KubeService>
}

export type LocalrunValueFile = {
  services: Services<LocalrunService>
  mocks: string
}

export interface OutputFormat<T extends ServiceOutputType> {
  serializeService(
    service: ServiceDefinitionForEnv,
    runtime: ReferenceResolver,
    env: EnvironmentConfig,
    featureDeployment?: string,
  ): Promise<SerializeSuccess<T> | SerializeErrors>

  serviceMockDef(options: {
    runtime: ReferenceResolver
    env: EnvironmentConfig
  }): T

  featureDeployment(service: ServiceDefinition, env: EnvironmentConfig): void
}
