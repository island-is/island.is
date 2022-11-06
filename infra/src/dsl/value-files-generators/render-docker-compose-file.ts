import { Kubernetes } from '../kubernetes-runtime'
import {
  DockerComposeService,
  DockerComposeValueFile,
  HelmValueFile,
  ServiceHelm,
  Services,
} from '../types/output-types'
import { renderers } from '../service-dependencies'

const renderDockerComposeFile = async (
  uberChart: Kubernetes,
  services: Services<DockerComposeService>,
): Promise<DockerComposeValueFile> => {
  const dockerComposeServices: Services<DockerComposeService> = Object.entries(
    services,
  ).reduce(async (acc, [name, service]) => {
    const accVal = acc
    return {
      ...accVal,
      [name]: service,
    }
  }, uberChart.env.global)
  // const servicesAndMocks = Object.entries(uberChart.deps).reduce(
  //   (acc, [name, svcs]) => {
  //     if (name.startsWith('mock-')) {
  //       return {
  //         ...acc,
  //         [name]: serviceMockDef({
  //           namespace: svcs.values().next().value.serviceDef.namespace,
  //           target: name,
  //         }),
  //       }
  //     }
  //     return {
  //       ...acc,
  //     }
  //   },
  //   helmServices,
  // )
  return {
    services: dockerComposeServices,
  }
}
