import { Service } from './types/input-types'
import { OutputFormat, ServiceHelm } from './types/output-types'
import { Kubernetes } from './kubernetes'

export function processForFeatureDeployment(
  services: Service[],
  outputFormat: OutputFormat<ServiceHelm>,
  uberChart: Kubernetes,
) {
  for (const servicesAndMock of services) {
    outputFormat.featureDeployment(servicesAndMock, uberChart.env)
  }
}
