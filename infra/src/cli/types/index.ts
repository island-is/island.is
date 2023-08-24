import { OpsEnv } from '../../dsl/types/input-types'
import { ChartName } from '../../uber-charts/all-charts'

export { OpsEnv } from '../../dsl/types/input-types'

export {
  ChartName,
  ChartNames,
  OpsEnvNames,
} from '../../uber-charts/all-charts'

export interface RenderEnvArgs {
  env: OpsEnv
  chart: ChartName
}

export interface RenderUrlsArgs {
  env: OpsEnv
}

export interface RenderSecretsArgs {
  service: string
}

export interface RenderLocalEnvArgs {
  services: string[]
}

export interface GetSecretsArgs {
  services: string[]
  reset: boolean
  help: boolean
}

export type EnvObject = Record<string, string>

export type EnvDifferences = {
  added: [string, string][]
  changed: [string, string][]
}

export type EnvMappingType = {
  ssmParameters: string[]
  isBashEnv: boolean
}
