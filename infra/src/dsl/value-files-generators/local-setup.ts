import {
  LocalrunService,
  LocalrunValueFile,
  Services,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { shouldIncludeEnv } from '../../cli/render-env-vars'
import { readFile, writeFile } from 'fs/promises'
import { globSync } from 'glob'
import { join } from 'path'
import { rootDir } from '../consts'
import { logger } from '../../common/logging'
import { nxCommand } from '../../common/nx-command'
import { z } from 'zod'
import { schemaLoader } from '../../common/schema-loader'

interface ProjectInfo {
  serviceName: string
  projectPath: string
}
const mapServiceToNXname = async (
  serviceName: string,
): Promise<ProjectInfo | null> => {
  const params = {
    command: `show project ${serviceName} --json --output-style static`,
    parseJson: true,
  }
  const projectMeta = await nxCommand(params)

  try {
    const validatedProjectMeta: NxProjectSchema = nxProjectSchema.parse(
      projectMeta.stdout,
    )
    console.log('Validated project metadata:', validatedProjectMeta)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
    } else {
      console.error('Unexpected error:', error)
    }
  }

  // Handling services-bff logic
  if (serviceName.startsWith('services-bff-')) {
    serviceName = 'services-bff'
  }

  const projectInfo = (
    await Promise.all(
      projects.map(async (path) => {
        const project: {
          name: string
          targets: { [name: string]: any }
        } = JSON.parse(
          await readFile(join(projectRootPath, path), {
            encoding: 'utf-8',
          }),
        )

        // Check if the serviceName matches
        return typeof project.targets[`service-${serviceName}`] !== 'undefined'
          ? {
              serviceName: project.name,
              projectPath: join(projectRootPath, path),
            }
          : null
      }),
    )
  ).filter((info) => info !== null) as ProjectInfo[]

  if (nxName.length > 1)
    throw new Error(
      `More than one NX project found with service name ${serviceName} - ${projectInfo
        .map((info) => info.serviceName)
        .join(', ')}`,
    )
  }

  // Return the service name and project path
  return projectInfo.length === 1 ? projectInfo[0] : null
}

/**
 * This function `getLocalrunValueFile` is an asynchronous function that takes in a `runtime` object
 * and a `services` object. It returns a promise that resolves to a `LocalrunValueFile` object.
 *
 * The function processes the `services` and `runtime` objects to create configurations for Docker
 * and mock services. These configurations are then written to specific files in the root directory,
 * of the form `.env.${service-name}`.
 *
 * @param {Localhost} runtime - The runtime object.
 * @param {Services<LocalrunService>} services - The services object.
 * @returns {Promise<LocalrunValueFile>}
 */
export const getLocalrunValueFile = async (
  runtime: Localhost,
  services: Services<LocalrunService>,
  options: { dryRun?: boolean } = { dryRun: false },
): Promise<LocalrunValueFile> => {
  logger.debug('getLocalrunValueFile', { runtime, services })

  logger.debug('Process services', { services })
  const dockerComposeServices = {} as Services<LocalrunService>
  for (const [name, service] of Object.entries(services)) {
    const portConfig = runtime.ports[name]
      ? { PORT: runtime.ports[name].toString() }
      : {}
    const serviceNXName = await mapServiceToNXname(name)
    logger.debug('Process service', { name, service, serviceNXName })
    dockerComposeServices[name] = {
      env: Object.assign(
        {},
        Object.entries(service.env)
          .filter(shouldIncludeEnv)
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
        { PROD_MODE: 'true' },
        portConfig,
      ) as Record<string, string>,
      commands: [
        `cd "${rootDir}"`,
        `. ./.env.${serviceNXName}`, // `source` is bashism
        `echo "Starting ${name} in $PWD"`,
        `yarn nx serve ${serviceNXName}`,
      ],
    }
  }

  const firstService = Object.keys(dockerComposeServices)[0]
  logger.debug('Dump all env values to files', {
    dockerComposeServices,
    [`${firstService}.env`]: dockerComposeServices[firstService]?.env,
  })
  await Promise.all(
    Object.entries(dockerComposeServices).map(
      async ([name, svc]: [string, LocalrunService]) => {
        const result = await mapServiceToNXname(name)
        if (result === null) {
          throw new Error('No NX project found for the given service name.')
        }
        const { serviceName, projectPath } = result
        logger.debug(`Writing env to file for ${name}`, { name, serviceName })
        if (options.dryRun) return
        await writeFile(
          join(rootDir, `.env.${serviceNXName}`),
          Object.entries(svc.env)
            .filter(([name, value]) => shouldIncludeEnv(name) && !!value)
            .map(([name, value]) => {
              // Basic shell sanitation
              const escapedValue = value
                .replace(/'/g, "'\\''")
                .replace(/[\n\r]/g, '')
              const localizedValue = escapedValue
              //   .replace(
              //   /^(https?:\/\/)[^/]+(?=$|\/)/g,
              //   '$1localhost',
              // )
              const exportedKeyValue = `export ${name}='${localizedValue}'`
              logger.debug('Env rewrite debug', {
                escapedValue,
                localizedValue,
                exportedKeyValue,
              })

              return exportedKeyValue
            })
            .join('\n'),
          { encoding: 'utf-8' },
        )
      },
    ),
  )
  const mocksConfigs = Object.entries(runtime.mocks).reduce(
    (acc, [name, target]) => {
      return {
        ports: [...acc.ports, runtime.ports[name]],
        configs: [
          ...acc.configs,
          {
            protocol: 'http',
            name: name,
            port: runtime.ports[name],
            stubs: [
              {
                predicates: [{ equals: {} }],
                responses: [
                  {
                    proxy: {
                      to: target.replace('localhost', 'host.docker.internal'),
                      mode: 'proxyAlways',
                      predicateGenerators: [
                        {
                          matches: {
                            method: true,
                            path: true,
                            query: true,
                            body: true,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      }
    },
    { ports: [] as number[], configs: [] as any[] },
  )
  const defaultMountebankConfig = 'mountebank-imposter-config.json'
  logger.debug('Writing default mountebank config to file', {
    defaultMountebankConfig,
    mocksConfigs,
  })
  if (!options.dryRun)
    await writeFile(
      defaultMountebankConfig,
      JSON.stringify({ imposters: mocksConfigs.configs }),
      { encoding: 'utf-8' },
    )

  const mocksObj = {
    containerer: 'docker',
    containererCommand: 'run',
    containererFlags: '-it --rm',
    ports: ['2525', ...mocksConfigs.ports],
    mounts: [`${process.cwd()}/${defaultMountebankConfig}:/app/default.json:z`],
    image: 'docker.io/bbyars/mountebank:2.8.1',
    command: 'start --configfile=/app/default.json',
  }

  const mocks = [
    mocksObj.containerer,
    mocksObj.containererCommand,
    `--name ${mocksObj.image.split(':')[0].split('/').pop()}`,
    mocksObj.containererFlags,
    mocksObj.ports.map((p) => `-p ${p}:${p}`).join(' '),
    mocksObj.mounts.map((m) => `-v ${m}`).join(' '),
    mocksObj.image,
    mocksObj.command,
  ]
  const mocksStr = mocks.join(' ')
  logger.debug(`Docker command for mocks:`, { mocks })

  const renderedServices: Services<LocalrunService> = {}
  logger.debug('Debugging dockerComposeServices', {
    dockerComposeServices,
  })
  for (const [name, service] of Object.entries(dockerComposeServices)) {
    renderedServices[name] = { commands: service.commands, env: service.env }
    logger.debug(`Docker command for ${name}:`, { command: service.commands })
  }
  return {
    services: renderedServices,
    mocks: mocksStr,
  }
}
