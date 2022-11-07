import { Kubernetes } from '../kubernetes-runtime'
import {
  DockerComposeService,
  DockerComposeValueFile,
  Services,
} from '../types/output-types'

export const renderDockerComposeFile = (
  uberChart: Kubernetes,
  services: Services<DockerComposeService>,
): DockerComposeValueFile => {
  const dockerComposeServices: Services<DockerComposeService> = Object.entries(
    services,
  ).reduce((acc, [name, service]) => {
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
