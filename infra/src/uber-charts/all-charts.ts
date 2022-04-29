import { Services as ISServices } from './islandis'
import { Services as JSServices } from './judicial-system'
import { Services as IDSServices } from './identity-server'
import { EnvironmentServices } from '../dsl/types/charts'

export type ChartName = 'islandis' | 'judicial-system' | 'identity-server'
export const ChartNames: ChartName[] = ['islandis', 'judicial-system', 'identity-server']
export const OpsEnvNames = ['dev', 'staging', 'prod']
export const charts: { [name in ChartName]: EnvironmentServices } = {
  'identity-server' : IDSServices,
  islandis: ISServices,
  'judicial-system': JSServices,
}
