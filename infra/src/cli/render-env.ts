import { OpsEnv } from '../dsl/types/input-types'
import { Envs } from '../environments'
import { ChartName, Charts, Deployments } from '../uber-charts/all-charts'
import { renderHelmValueFileContent } from '../dsl/exports/helm'

export const renderEnv = async (env: OpsEnv, chartName: ChartName) => {
  return renderHelmValueFileContent(
    Envs[Deployments[chartName][env]],
    Charts[chartName][env],
    Charts[chartName][env],
    'no-mocks',
  )
}
