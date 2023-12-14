import { EnvironmentConfig } from '../types/charts'
import { ServiceBuilder } from '../dsl'
import { Localhost } from '../localhost-runtime'
import { renderers, withUpstreamDependencies } from '../upstream-dependencies'
import { hacks } from './hacks'
import { getLocalrunValueFile } from '../value-files-generators/local-setup'
import { generateOutput } from '../processing/rendering-pipeline'
import { logger } from '../../common'

export async function localrun(
  envConfig: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  runtime: Localhost,
  services: ServiceBuilder<any>[],
  { dryRun = false, noUpdateSecrets = false } = {},
) {
  logger.debug('localrun', { services, dryRun, noUpdateSecrets })
  const fullSetOfServices = await withUpstreamDependencies(
    envConfig,
    habitat,
    services,
    renderers.localrunNoSecrets,
    // dryRun || noUpdateSecrets
    //   ? renderers.localrunNoSecrets
    //   : renderers.localrun,
    { dryRun, noUpdateSecrets },
  )
  hacks(fullSetOfServices, habitat)

  return getLocalrunValueFile(
    runtime,
    await generateOutput({
      runtime: runtime,
      services: fullSetOfServices,
      outputFormat: renderers.localrunNoSecrets,
      // dryRun || noUpdateSecrets
      //   ? renderers.localrunNoSecrets
      //   : renderers.localrun,
      env: envConfig,
    }),
  )
}
