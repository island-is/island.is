import { OpsEnv } from '../dsl/types/input-types'
import { Kubernetes } from '../dsl/kubernetes-runtime'
import { Envs } from '../environments'
import { ChartName, Charts, Deployments } from '../uber-charts/all-charts'
import { dumpServiceHelm } from '../dsl/file-formats/yaml'
import { renderHelmValueFile } from '../dsl/value-files-generators/render-helm-value-file'
import { renderHelmServices } from '../dsl/exports/exports'

export const renderEnv = async (env: OpsEnv, chartName: ChartName) => {
  return renderHelmServices(
    Envs[Deployments[chartName][env]],
    Charts[chartName][env],
  )
}
