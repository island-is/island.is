import { Envs } from '../environments'
import { Charts, Deployments } from '../uber-charts/all-charts'
import { Localhost } from '../dsl/localhost-runtime'
import { localrun } from '../dsl/exports/localrun'
import { logger } from '../common'

export async function renderLocalServices(
  services: string[],
  options: { dryRun?: boolean } = { dryRun: false },
) {
  logger.info('renderLocalServices', { services, options })
  const chartName = 'islandis'
  const env = 'dev'
  const envConfig = Envs[Deployments[chartName][env]]
  envConfig.type = 'local'
  let uberChart = new Localhost()
  const habitat = Charts[chartName][env]
  return await localrun(
    envConfig,
    habitat,
    uberChart,
    habitat.filter((s) => services.includes(s.name())),
    options,
  )
}

export async function runLocalServices(
  services: string[],
  dependencies: string[] = [],
  options: { dryRun?: boolean } = { dryRun: false },
) {
  logger.info('runLocalServices', { services, dependencies })
  const renderedLocalServices = await renderLocalServices(services, {
    dryRun: options.dryRun,
  })
  for (const service of Object.keys(renderedLocalServices.services)) {
    if (dependencies.length > 0 && !dependencies.includes(service)) {
      logger.info(`Skipping ${service} as it is not specified as a dependency`)
      continue
    }
    logger.info(`Running ${service} in the background`)
  }
  return
}
