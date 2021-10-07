import { Services as ISServices } from './islandis'
import { Services as JSServices } from './judicial-system'
import { Services as ADSServices } from './air-discount-scheme'
import { EnvironmentServices } from '../dsl/types/charts'

export type ChartName = 'islandis' | 'judicial-system' | 'air-discount-scheme'
export const ChartNames: ChartName[] = [
  'islandis',
  'judicial-system',
  'air-discount-scheme',
]
export const OpsEnvNames = ['dev', 'staging', 'prod']
export const charts: { [name in ChartName]: EnvironmentServices } = {
  islandis: ISServices,
  'judicial-system': JSServices,
  'air-discount-scheme': ADSServices,
}
