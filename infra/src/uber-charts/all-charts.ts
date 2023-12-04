import { Services as ISServices } from './islandis'
import { Services as JSServices } from './judicial-system'
import { Services as IDSServices } from './identity-server'
import { EnvironmentServices, OpsEnvName } from '../dsl/types/charts'
import { OpsEnv } from '../dsl/types/input-types'

export type ChartName = 'islandis' | 'judicial-system' | 'identity-server'
export const ChartNames: ChartName[] = [
  'islandis',
  'judicial-system',
  'identity-server',
]
export const OpsEnvNames: OpsEnv[] = ['dev', 'staging', 'prod']
export const Charts: { [name in ChartName]: EnvironmentServices } = {
  'identity-server': IDSServices,
  islandis: ISServices,
  'judicial-system': JSServices,
}

export const Deployments: {
  [name in ChartName]: { [env in OpsEnv]: OpsEnvName }
} = {
  'judicial-system': { dev: 'dev01', staging: 'staging01', prod: 'prod' },
  islandis: { dev: 'dev01', staging: 'staging01', prod: 'prod' },
  'identity-server': { dev: 'devIds', staging: 'stagingIds', prod: 'prodIds' },
}
