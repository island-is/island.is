import { Service } from '../types/input-types'
import { Kubernetes } from '../kubernetes-runtime'
import { dumpServiceHelm } from '../file-formats/yaml'
import { renderHelmValueFile } from '../output-generators/render-helm-value-file'
import { EnvironmentConfig } from '../types/charts'

export const renderHelmServices = async (
  env: EnvironmentConfig,
  services: Service[],
) => {
  let uberChart = new Kubernetes(env)
  return dumpServiceHelm(uberChart, await renderHelmValueFile(uberChart, []))
}
