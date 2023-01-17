import {
  LocalrunService,
  LocalrunValueFile,
  Services,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { EXCLUDED_ENVIRONMENT_NAMES } from '../../cli/render-env-vars'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const mapServiceToNXname = async (serviceName: string) => {
  const projectRootPath = join(__dirname, '..', '..', '..', '..')
  const fileContent = await readFile(join(projectRootPath, 'workspace.json'), {
    encoding: 'utf-8',
  })
  const workspace: { projects: { [name: string]: string } } = JSON.parse(
    fileContent,
  )
  const nxName = (
    await Promise.all(
      Object.entries(workspace.projects)
        .filter((space) => space[1].startsWith('apps/'))
        .map(async (space) => {
          const project: { targets: { [name: string]: any } } = JSON.parse(
            await readFile(join(projectRootPath, space[1], 'project.json'), {
              encoding: 'utf-8',
            }),
          )
          return typeof project.targets[`service-${serviceName}`] !==
            'undefined'
            ? space[0]
            : null
        }),
    )
  ).filter((name) => name !== null) as string[]

  if (nxName.length > 1)
    throw new Error(
      `More then one NX projects found with service name ${serviceName} - ${nxName.join(
        ',',
      )}`,
    )
  return nxName.length === 1 ? nxName[0] : serviceName
}

export const getLocalrunValueFile = async (
  runtime: Localhost,
  services: Services<LocalrunService>,
): Promise<LocalrunValueFile> => {
  const dockerComposeServices: Services<LocalrunService> = await Object.entries(
    services,
  ).reduce(async (acc, [name, service]) => {
    return {
      ...(await acc),
      [name]: ` ${
        runtime.ports[name] ? `PORT=${runtime.ports[name]} ` : ''
      } PROD_MODE=true ${Object.entries(service.env)
        .filter(([name, val]) => !EXCLUDED_ENVIRONMENT_NAMES.includes(name))
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')} yarn start ${await mapServiceToNXname(name)}`,
    }
  }, Promise.resolve({}))
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
                      // soffia proxy service hack. need to get this proxy to forward host header but not really how to do it yet.
                      ...(target === 'https://localhost:8443'
                        ? {
                            injectHeaders: {
                              Host: 'soffiaprufa.skra.is',
                            },
                          }
                        : {}),
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
  await writeFile(
    defaultMountebankConfig,
    JSON.stringify({ imposters: mocksConfigs.configs }),
    { encoding: 'utf-8' },
  )

  const mocks = `docker run -it --rm -p 2525:2525 ${mocksConfigs.ports
    .map((port) => `-p ${port}:${port}`)
    .join(
      ' ',
    )} -v ${process.cwd()}/${defaultMountebankConfig}:/app/default.json bbyars/mountebank:2.8.1 start --configfile=/app/default.json`

  return {
    services: { ...dockerComposeServices },
    mocks: mocks,
  }
}
