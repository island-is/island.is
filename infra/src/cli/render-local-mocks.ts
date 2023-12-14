import { Envs } from '../environments'
import { Charts, Deployments } from '../uber-charts/all-charts'
import { Localhost } from '../dsl/localhost-runtime'
import { localrun } from '../dsl/exports/localrun'
import { logger } from '../common'
import { ChildProcess, exec, spawn } from 'child_process'
import { LocalrunValueFile } from '../dsl/types/output-types'

export async function renderLocalServices(
  services: string[],
  { dryRun = false, print = false, json = false, noUpdateSecrets = false } = {},
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
    { dryRun, noUpdateSecrets },
  )

  if (print) {
    const commandedServices = Object.entries(
      renderedLocalServices.services,
    ).map(([k, v]) => [k, `(${(v.commands ?? []).join(' && ')})`])
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
  {
    dryRun = false,
    neverFail = !!dryRun,
    print = false,
    json = false,
    noUpdateSecrets = false,
  }: {
    dryRun?: boolean
    neverFail?: boolean
    print?: boolean
    json?: boolean
    noUpdateSecrets?: boolean
  } = {},
) {
  logger.debug('runLocalServices', { services, dependencies })
  const renderedLocalServices = await renderLocalServices(services, {
    dryRun,
    print,
    json,
    noUpdateSecrets,
  })

  const processes: Promise<ChildProcess>[] = []

  for (const [name, service] of Object.entries(
    renderedLocalServices.services,
  )) {
    if (dependencies.length > 0 && !dependencies.includes(name)) {
      logger.info(`Skipping ${name} as it is not specified as a dependency`)
      continue
    }
    const builtCommand = [
      dryRun ? 'false' : 'true',
      ...(service.commands ?? []),
    ].join(' && ')
    const noFailCommand = [builtCommand, neverFail ? 'true' : 'false'].join(
      ' || ',
    )
    logger.info(`Running ${name} in the background`)
    logger.debug('Running in the background', {
      service: name,
      command: noFailCommand,
      builtCommand,
    })

    const procSpawn = spawn(noFailCommand, {
      shell: true,
      stdio: 'inherit',
    })

    procSpawn.stdout?.on('data', (data) => {
      logger.info(`${name}: ${data}`)
    })
    procSpawn.stdout?.on('data', (data) => {
      logger.error(`${name}: ${data}`)
    })

    const proc = exec(noFailCommand, (err, stdout, stderr) => {
      if (err) {
        logger.error(`Error running ${name}`, { err })
      }
      if (stdout) {
        logger.info(`stdout: ${stdout}`)
      }
      if (stderr) {
        logger.error(`stderr: ${stderr}`)
      }
      return
    })
    processes.push(new Promise((resolve) => proc.on('exit', resolve)))
  }

  // Wait for all processes to complete
  await Promise.all(processes)
  logger.info('All processes completed')
}
