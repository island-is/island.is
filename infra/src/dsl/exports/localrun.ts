import { EnvironmentConfig } from '../types/charts'
import { ServiceBuilder } from '../dsl'
import { Localhost } from '../localhost-runtime'
import { renderers, withUpstreamDependencies } from '../upstream-dependencies'
import { hacks } from './hacks'
import { getLocalSetup } from '../value-files-generators/get-local-setup'
import { renderer } from '../processing/service-sets'

export async function localrun(
  envConfig: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  runtime: Localhost,
  services: ServiceBuilder<any>[],
) {
  const fullSetOfServices = await withUpstreamDependencies(
    envConfig,
    habitat,
    services,
    renderers.localrun,
  )
  hacks(fullSetOfServices, habitat)

  return getLocalSetup(
    runtime,
    await renderer(runtime, fullSetOfServices, renderers.localrun, envConfig),
  )
}
