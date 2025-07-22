import { Envs } from '../environments'
import { Charts, Deployments } from '../uber-charts/all-charts'
import { Localhost } from '../dsl/localhost-runtime'
import { localrun } from '../dsl/exports/localrun'
import { logger, runCommand } from '../common'
import { ChildProcess } from 'child_process'
import { LocalrunValueFile } from '../dsl/types/output-types'

export async function renderLocalServices({
  services,
  print = false,
  json = false,
  dryRun = false,
  noUpdateSecrets = false,
}: {
  services: string[]
  print?: boolean
  json?: boolean
  dryRun?: boolean
  noUpdateSecrets?: boolean
}): Promise<LocalrunValueFile> {
  logger.debug('renderLocalServices', {
    services,
    print,
    json,
    dryRun,
    noUpdateSecrets,
  })
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
    { dryRun, noUpdateSecrets },
  )

  if (print) {
    const commandedServices = Object.entries(
      renderedLocalServices.services,
    ).map(([k, v]) => [k, `(${(v.commands ?? []).join(' && ')})`])
    logger.info(
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
  {
    dryRun = false,
    neverFail = !!dryRun,
    print = false,
    json = false,
    noUpdateSecrets = false,
    startProxies = false,
  }: {
    dryRun?: boolean
    neverFail?: boolean
    print?: boolean
    json?: boolean
    noUpdateSecrets?: boolean
    startProxies?: boolean
  } = {},
) {
  logger.debug('runLocalServices', { services, dependencies })

  // Add the service itself to the list of dependencies
  dependencies.push(...services)

  const renderedLocalServices = await renderLocalServices({
    services,
    print,
    json,
    dryRun,
    noUpdateSecrets,
  })

  // Verify that all dependencies exist in the rendered dependency list
  for (const dependency of dependencies) {
    if (!renderedLocalServices.services[dependency]) {
      throw new Error(`Dependency ${dependency} not found`)
    }
  }

  const processes: Promise<ChildProcess>[] = []

  // Start mocks & proxies
  if (startProxies) {
    logger.warn('Starting proxies in the background')
    processes.push(
      runCommand({
        command: '$PWD/scripts/run-proxies.sh',
        project: 'proxies',
        dryRun,
      }),
    )
  }
  if (renderedLocalServices.mocks) {
    logger.warn('Starting mocks in the background')
    const options = {
      command: renderedLocalServices.mocks,
      project: 'mocks',
      dryRun,
    }
    logger.debug('Mocks command options', { options })
    processes.push(runCommand(options))
  }

  for (const [name, service] of Object.entries(
    renderedLocalServices.services,
  )) {
    if (dependencies.length > 0 && !dependencies.includes(name)) {
      logger.info(`Skipping ${name} (not a dependency)`)
      continue
    }
    const chainedCommand = [
      // dryRun ? 'false' : 'true',
      ...(service.commands ?? []),
    ].join(' && ')
    const unfailingCommand = [
      chainedCommand,
      ...(neverFail ? ['true'] : []),
    ].join(' || ')
    const command = unfailingCommand
    logger.warn(`Starting ${name} in the background`)
    logger.debug('Running in the background', {
      service: name,
      unfailingCommand,
      chainedCommand,
      command,
    })
    if (print) {
      logger.info('Commands being run:', { [name]: command })
    }

    const proc = await runCommand({ command, project: name, dryRun })

    processes.push(new Promise((resolve) => proc.on('exit', resolve)))
  }

  // Wait for all processes to complete
  await Promise.all(processes)
  logger.info('All processes completed')
}
