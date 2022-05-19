import { Services as ISServices } from './islandis'
import { Services as JSServices } from './judicial-system'
import { Services as IDSServices } from './identity-server'
import { EnvironmentServices, OpsEnvName } from '../dsl/types/charts'

export type ChartName = 'islandis' | 'judicial-system' | 'identity-server'
export const ChartNames: ChartName[] = [
  'islandis',
  'judicial-system',
  'identity-server',
]
export const OpsEnvNames: OpsEnvName[] = [
  'dev01',
  'staging01',
  'prod',
  'prod-ids',
]
export const charts: { [name in ChartName]: EnvironmentServices } = {
  'identity-server': IDSServices,
  islandis: ISServices,
  'judicial-system': JSServices,
}
