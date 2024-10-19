import {
  LocalrunService,
  LocalrunValueFile,
  Services,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { shouldIncludeEnv } from '../../cli/render-env-vars'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { rootDir } from '../consts'
import { logger } from '../../common/logging'
import { nxCommand } from '../../common/nx-command'
import { z } from 'zod'
import { type ProjectInfo, nxProjectSchema } from '../../types/nx-project'

/**
 * Maps a service name to its corresponding NX project name and path.
 * Uses nxCommand to retrieve and validate the project metadata using the nxProjectSchema.
 */
export const mapServiceToNXname = async (
  serviceName: string,
): Promise<ProjectInfo | null> => {
  try {
    if (serviceName.startsWith('services-bff-')) {
      serviceName = 'services-bff'
    }

    const validatedProjectMeta = await nxCommand({
      command: `show project ${serviceName} --json --output-style static`,
      parseJson: true,
      schema: nxProjectSchema, // Pass the actual Zod schema for runtime validation
    })

    if (!validatedProjectMeta.name || !validatedProjectMeta.sourceRoot) {
      throw new Error(
        `Project metadata is missing required fields: name or sourceRoot.`
      );
    }

    return {
      serviceName: validatedProjectMeta.name,
      projectPath: validatedProjectMeta.sourceRoot,
    };
  } catch (error) {
    logger.error('Error in mapServiceToNXname:', error);

    if (error instanceof Error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }
    throw new Error('An unknown error occurred.');
  }
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

  const dockerComposeServices = {} as Services<LocalrunService>

  for (const [name, service] of Object.entries(services)) {
    const portConfig = runtime.ports[name]
      ? { PORT: runtime.ports[name].toString() }
      : {}
    const serviceNXName = await mapServiceToNXname(name)
    logger.debug('Process service', { name, service, serviceNXName })

    if (serviceNXName) {
      dockerComposeServices[name] = {
        env: {
          ...Object.entries(service.env)
            .filter(shouldIncludeEnv)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
          PROD_MODE: 'true',
          ...portConfig,
        },
        commands: [
          `cd "${rootDir}"`,
          `. ./.env.${serviceNXName.serviceName}`, // `source` is bashism
          `echo "Starting ${name} in $PWD"`,
          `yarn nx serve ${serviceNXName.serviceName}`,
        ],
      }
    }
  }

  const firstService = Object.keys(dockerComposeServices)[0]
  logger.debug('Dump all env values to files', {
    dockerComposeServices,
    [`${firstService}.env`]: dockerComposeServices[firstService]?.env,
  })

  await Promise.all(
    Object.entries(dockerComposeServices).map(async ([name, svc]) => {
      const result = await mapServiceToNXname(name)
      if (result === null) {
        throw new Error('No NX project found for the given service name.')
      }
      const { serviceName } = result
      logger.debug(`Writing env to file for ${name}`, { name, serviceName })
      if (options.dryRun) return
      await writeFile(
        join(rootDir, `.env.${serviceName}`),
        Object.entries(svc.env)
          .filter(([key, value]) => shouldIncludeEnv(key) && !!value)
          .map(([key, value]) => {
            const escapedValue = value
              .replace(/'/g, "'\\''")
              .replace(/[\n\r]/g, '')
            return `export ${key}='${escapedValue}'`
          })
          .join('\n'),
        { encoding: 'utf-8' },
      )
    }),
  )

  const mocksConfigs = Object.entries(runtime.mocks).reduce(
    (acc, [name, target]) => ({
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
    }),
    { ports: [] as number[], configs: [] as any[] },
  )

  const defaultMountebankConfig = 'mountebank-imposter-config.json'
  logger.debug('Writing default mountebank config to file', {
    defaultMountebankConfig,
    mocksConfigs,
  })

  if (!options.dryRun) {
    await writeFile(
      defaultMountebankConfig,
      JSON.stringify({ imposters: mocksConfigs.configs }),
      { encoding: 'utf-8' },
    )
  }

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

  logger.debug(`Docker command for mocks:`, { mocks })

  const renderedServices: Services<LocalrunService> = {}
  for (const [name, service] of Object.entries(dockerComposeServices)) {
    renderedServices[name] = { commands: service.commands, env: service.env }
  }

  return {
    services: renderedServices,
    mocks: mocks.join(' '),
  }
}
