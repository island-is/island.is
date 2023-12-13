import { EnvironmentConfig } from '../types/charts'
import { ServiceBuilder } from '../dsl'
import { Localhost } from '../localhost-runtime'
import { renderers, withUpstreamDependencies } from '../upstream-dependencies'
import { hacks } from './hacks'
import { getLocalrunValueFile } from '../value-files-generators/local-setup'
import { generateOutput } from '../processing/rendering-pipeline'

export async function localrun(
  envConfig: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  runtime: Localhost,
  services: ServiceBuilder<any>[],
  { dryRun = false },
) {
  const fullSetOfServices = await withUpstreamDependencies(
    envConfig,
    habitat,
    services,
    renderers.localrun,
  )
  hacks(fullSetOfServices, habitat)

  return getLocalrunValueFile(
    runtime,
    await generateOutput({
      runtime: runtime,
      services: fullSetOfServices,
      outputFormat: renderers.localrun,
      env: envConfig,
    }),
  )
}
