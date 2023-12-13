import { Envs } from '../environments'
import { Charts, Deployments } from '../uber-charts/all-charts'
import { Localhost } from '../dsl/localhost-runtime'
import { localrun } from '../dsl/exports/localrun'
import { logger } from '../common'
import { ChildProcess, exec } from 'child_process'
import { LocalrunValueFile } from '../dsl/types/output-types'

export async function renderLocalServices(
  services: string[],
  { dryRun = false, print = false, json = false } = {},
): Promise<LocalrunValueFile> {
  logger.debug('renderLocalServices', { services, dryRun, print, json })
  const chartName = 'islandis'
  const env = 'dev'
  const envConfig = Envs[Deployments[chartName][env]]
  envConfig.type = 'local'
  let uberChart = new Localhost()
  const habitat = Charts[chartName][env]
  const renderedLocalServices = await localrun(
    envConfig,
    habitat,
    uberChart,
    habitat.filter((s) => services.includes(s.name())),
    { dryRun },
  )

  if (print) {
    const commandedServices = Object.entries(
      renderedLocalServices.services,
    ).map(([k, v]) => [k, `(${(v.command ?? []).join(' && ')})`])
    console.log(
      (json ? (s: any) => JSON.stringify(s, null, 2) : (s: any) => s)({
        mocks: renderedLocalServices.mocks,
        services: Object.fromEntries(commandedServices),
      }),
    )
  }

  return renderedLocalServices
}

export async function runLocalServices(
  services: string[],
  dependencies: string[] = [],
  options: { dryRun?: boolean } = { dryRun: false },
) {
  logger.debug('runLocalServices', { services, dependencies })
  const renderedLocalServices = await renderLocalServices(services, {
    dryRun: options.dryRun,
  })

  const processes: Promise<ChildProcess>[] = []

  for (const [name, service] of Object.entries(
    renderedLocalServices.services,
  )) {
    if (dependencies.length > 0 && !dependencies.includes(name)) {
      logger.info(`Skipping ${name} as it is not specified as a dependency`)
      continue
    }
    logger.warn(`Running ${name} in the background`)
    logger.info('Running in the background', {
      service: name,
      command: service,
    })
    const command = options.dryRun
      ? 'echo'
      : (service.command ?? []).join(' && ')
    const proc = exec(command, (err, stdout, stderr) => {
      if (err) {
        logger.error(`Error running ${name}`, { err })
      }
      return
    })
    processes.push(new Promise((resolve) => proc.on('exit', resolve)))
  }

  // Wait for all processes to complete
  await Promise.all(processes)
}
