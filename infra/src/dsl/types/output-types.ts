import { Hash, ReplicaCount, Service, ValueType } from './input-types'
import { UberChartType } from './charts'

// Output types
export type ContainerRunHelm = {
  command: string[]
  args?: string[]
  name?: string
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

export type ContainerEnvironmentVariables = { [name: string]: string }
export type ContainerSecrets = { [name: string]: string }

export interface ServiceHelm {
  replicaCount?: ReplicaCount
  healthCheck: {
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
    secrets?: { [key: string]: string }
    env?: { [key: string]: string }
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
  grantNamespaces: string[]
  grantNamespacesEnabled: boolean

  env?: ContainerEnvironmentVariables
  secrets?: ContainerSecrets
  enabled: boolean
  namespace: string
  image: {
    repository: string
  }
  extra?: Hash
  strategy?: {
    type: 'RollingUpdate' | 'Recreate'
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

export type SerializeSuccess = {
  type: 'success'
  serviceDef: ServiceHelm
}

export type SerializeErrors = {
  type: 'error'
  errors: string[]
}

export type SerializeMethod = <FeatureToggles extends string>(
  service: Service,
  uberChart: UberChartType,
  featuresOn?: FeatureToggles[],
) => SerializeSuccess | SerializeErrors

export type ValueFile = { [name: string]: ServiceHelm }
