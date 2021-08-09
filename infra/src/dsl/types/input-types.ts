import { EnvironmentConfig } from './charts'

export type OpsEnv = 'dev' | 'staging' | 'prod'
export const MissingSetting = 'Missing setting'
export type MissingSettingType = typeof MissingSetting
export interface Service<FeatureToggles extends string> {
  serviceDef: ServiceDefinition<FeatureToggles>
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

export type Toggle = {
  env: EnvironmentVariables
  secrets: Secrets
}

export type ServiceDefinition<FeatureToggles extends string> = {
  liveness: HealthProbe
  readiness: HealthProbe
  port?: number
  initContainers?: InitContainers
  env: EnvironmentVariables
  secrets: Secrets
  ingress: { [name: string]: Ingress }
  toggles?: { [name in FeatureToggles]: Toggle }
  postgres?: PostgresInfo
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
  resources?: Resources
  replicaCount?: ReplicaCount
  securityContext: {
    privileged: boolean
    allowPrivilegeEscalation: boolean
  }
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
  limits?: {
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
  secrets?: { [key: string]: SecretType }
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
export type SecretType = string

export type EnvironmentVariableValue =
  | {
      [idx in OpsEnv]: ValueType
    }
  | ValueType

export type EnvironmentVariables = {
  [name: string]: EnvironmentVariableValue
}
export type ExtraValues = { [idx in OpsEnv]: Hash | MissingSettingType }
