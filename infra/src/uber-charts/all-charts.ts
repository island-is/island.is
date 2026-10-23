import { Services as JSServices } from './judicial-system'
import { EnvironmentServices, OpsEnvName } from '../dsl/types/charts'
import { OpsEnv } from '../dsl/types/input-types'

export type ChartName = 'judicial-system'
export const ChartNames: ChartName[] = ['judicial-system']
export const OpsEnvNames: OpsEnv[] = ['dev', 'staging', 'prod']
export const Charts: { [name in ChartName]: EnvironmentServices } = {
  'judicial-system': JSServices,
}

export const Deployments: {
  [name in ChartName]: { [env in OpsEnv]: OpsEnvName }
} = {
  'judicial-system': { dev: 'dev01', staging: 'staging01', prod: 'prod' },
}
