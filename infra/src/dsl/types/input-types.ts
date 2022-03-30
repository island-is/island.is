import { FeatureNames } from '../features'
import { EnvironmentConfig, UberChartType } from './charts'
import { UberChart } from '../uber-chart'
import { FeatureKubeJob } from './output-types'

export type OpsEnv = 'dev' | 'staging' | 'prod'
export const MissingSetting = 'Missing setting'
export type MissingSettingType = typeof MissingSetting
export interface Service {
  serviceDef: ServiceDefinition
}
// Input types
export type Hash = { [name: string]: Hash | string }
export type ValueSource = string | ((e: Context) => string)
export type ValueType = MissingSettingType | ValueSource

export type PostgresInfo = {
  host?: {
    [idx in OpsEnv]: ValueType
  }
  name?: string
  username?: string
  passwordSecret?: string
}

export type HealthProbe = {
  path: string
  initialDelaySeconds: number
  timeoutSeconds: number
}

export type Secrets = { [name: string]: string }

export type EnvironmentVariableValue =
  | {
      [idx in OpsEnv]: ValueType
    }
  | ValueType

export type EnvironmentVariables = {
  [name: string]: EnvironmentVariableValue
}

export interface XroadConfig {
  getEnv(): EnvironmentVariables
  getSecrets(): Secrets
}
export type Feature = {
  env: EnvironmentVariables
  secrets: Secrets
}

export type Features = { [name in FeatureNames]: Feature }
export type MountedFile = { filename: string; env: string }

export type InfrastructureResource = {
  featureDeploymentProvision(): Promise<void>
  featureDeploymentConfig(): object[]
  featureDeploymentCleanup(): Promise<void>
  prodDeploymentConfig(
    serviceDef: ServiceDefinition,
    uberChart: UberChartType,
    service: Service,
    featureDeployment?: string,
  ): {
    env: { [p: string]: string }
    secrets: { [p: string]: string }
    errors: string[]
  }
  featureDeploymentProvisionManifest(
    uberChart: UberChart,
    service: Service,
    image: string,
  ): FeatureKubeJob['spec']['template']['spec']['containers']
}

export type ServiceDefinition = {
  liveness: HealthProbe
  readiness: HealthProbe
  port?: number
  initContainers?: {
    envs?: EnvironmentVariables
    secrets?: Secrets
    features?: Partial<Features>
    containers: {
      command: string
      args?: string[]
      name?: string
      resources?: Resources
    }[]
    infraResource: InfrastructureResource[]
  }
  env: EnvironmentVariables
  secrets: Secrets
  ingress: { [name: string]: Ingress }
  features: Partial<Features>
  postgres?: PostgresInfo
  infraResource: InfrastructureResource[]
  namespace: string
  grantNamespaces: string[]
  grantNamespacesEnabled: boolean
  name: string
  accountName?: string
  serviceAccountEnabled: boolean
  cmds?: string
  args?: string[]
  extraAttributes?: ExtraValues
  image?: string
  resources: Resources
  replicaCount?: ReplicaCount
  securityContext: {
    privileged: boolean
    allowPrivilegeEscalation: boolean
  }
  xroadConfig: XroadConfig[]
  files: MountedFile[]
}

export interface Ingress {
  host: {
    [name in OpsEnv]: string | string[]
  }
  paths: string[]
  public?: boolean
  extraAnnotations?: { [name in OpsEnv]: { [idx: string]: string | null } }
}
export type Resources = {
  limits: {
    cpu: string
    memory: string
  }
  requests: {
    cpu: string
    memory: string
  }
}

export type ReplicaCount = {
  default: number
  max: number
  min: number
}

export type InitContainers = {
  envs?: EnvironmentVariables
  secrets?: Secrets
  features?: Partial<Features>
  containers: {
    command: string
    args?: string[]
    name?: string
    resources?: Resources
  }[]
  postgres?: PostgresInfo
}

export interface Context {
  featureName?: string
  svc(dep: Service): string
  env: EnvironmentConfig
}

export type ExtraValues = { [idx in OpsEnv]: Hash | MissingSettingType }
