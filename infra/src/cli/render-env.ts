import { OpsEnv } from '../dsl/types/input-types'
import { Envs } from '../environments'
import { ChartName, Charts, Deployments } from '../uber-charts/all-charts'
import { renderHelmValueFileContent } from '../dsl/exports/helm'
import { renderKubeValueFileContent } from '../dsl/exports/kube-native'

export const renderEnv = async (env: OpsEnv, chartName: ChartName) => {
  return renderHelmValueFileContent(
    Envs[Deployments[chartName][env]],
    Charts[chartName][env],
    Charts[chartName][env],
    'no-mocks',
  )
}

export const renderKubeEnv = async (env: OpsEnv, chartName: ChartName) => {
  return renderKubeValueFileContent(
    Charts[chartName][env],
    Envs[Deployments[chartName][env]],
  )
}