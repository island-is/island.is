import {
  Hash,
  PersistentVolumeClaim,
  ReplicaCount,
  Service,
} from './input-types'
import { DeploymentRuntime } from './charts'
import { FeatureNames } from '../features'
import { serviceMockDef } from '../map-to-docker-compose'

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
export type OutputPersistentVolumeClaim = {
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
export type ContainerEnvironmentVariables = { [name: string]: string }
export type ContainerSecrets = { [name: string]: string }

export interface ServiceHelm {
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
  pvcs?: OutputPersistentVolumeClaim[]
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

export interface DockerComposeService {
  env: ContainerEnvironmentVariables
  image: string
  command?: string[]
  port?: number
  depends_on: {
    [name: string]: {
      condition:
        | 'service_completed_successfully'
        | 'service_healthy'
        | 'service_started'
    }
  }
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
  serviceDef: T
}

export type SerializeErrors = {
  type: 'error'
  errors: string[]
}

export type Output = 'helm' | 'docker-compose'
export type ServiceOutputType = ServiceHelm | DockerComposeService

export type SerializeMethod<T extends ServiceOutputType> = (
  service: Service,
  uberChart: DeploymentRuntime,
  featuresOn?: FeatureNames[],
) => SerializeSuccess<T> | SerializeErrors

export type Services<T extends ServiceOutputType> = {
  [name: string]: T
}

export type ValueFile<T extends ServiceOutputType> = {
  namespaces: string[]
  services: Services<T>
}

export interface OutputFormat<T extends ServiceOutputType> {
  serializeService(
    service: Service,
    uberChart: DeploymentRuntime,
    featuresOn?: FeatureNames[],
  ): SerializeSuccess<T> | SerializeErrors

  serviceMockDef(options: { namespace: string; target: string }): T
}
