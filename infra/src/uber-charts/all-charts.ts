import { Services as ISServices } from './islandis'
import { Services as JSServices } from './judicial-system'
import { EnvironmentServices } from '../dsl/types/charts'

export type ChartName = 'islandis' | 'judicial-system'
export const ChartNames: ChartName[] = ['islandis', 'judicial-system']
export const OpsEnvNames = ['dev', 'staging', 'prod']
export const charts: { [name in ChartName]: EnvironmentServices } = {
  islandis: ISServices,
  'judicial-system': JSServices,
}
