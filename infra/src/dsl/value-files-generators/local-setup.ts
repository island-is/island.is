import {
  LocalrunService,
  LocalrunValueFile,
  Services,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { isLocalEnvWithService } from '../../cli/render-env-vars'
import { readFile, writeFile } from 'fs/promises'
import { globSync } from 'glob'
import { join } from 'path'
import { rootDir } from '../consts'
import { readdirSync, existsSync, mkdirSync } from 'fs'

type MountebankConfig = {
  protocol: string
  name: string
  port: number
  stubs: [
    {
      predicates: any[] //[{ equals: {} }],
      responses: [
        {
          proxy: {
            to: string
            mode: string
            // soffia proxy service hack. need to get this proxy to forward host header but not really how to do it yet.
            injectHeaders?: {
              Host: string
            }
            predicateGenerators: [
              {
                matches: {
                  method: boolean
                  path: boolean
                  query: boolean
                  body: boolean
                }
              },
            ]
          }
        },
      ]
    },
  ]
}

const mapServiceToNXname = async (serviceName: string) => {
  const projectRootPath = join(__dirname, '..', '..', '..', '..')
  const projects = globSync(['apps/*/project.json', 'apps/*/*/project.json'], {
    cwd: projectRootPath,
  })
  const nxName = (
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
        return typeof project.targets[`service-${serviceName}`] !== 'undefined'
          ? project.name
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
  const dockerComposeServices = await Object.entries(services).reduce(
    async (acc, [name, service]) => {
      const portConfig = runtime.ports[name]
        ? { PORT: runtime.ports[name].toString() }
        : {}
      const serviceNXName = await mapServiceToNXname(name)
      return {
        ...(await acc),
        [name]: {
          env: Object.assign(
            {},
            Object.entries(service.env)
              .filter(isLocalEnvWithService(serviceNXName))
              .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
            { PROD_MODE: 'true' },
            portConfig,
          ) as Record<string, string>,
          command: `(source ${join(
            rootDir,
            '.env.' + serviceNXName,
          )} && yarn start ${serviceNXName})`,
        },
      }
    },
    Promise.resolve(
      {} as {
        [name: string]: { env: Record<string, string>; command: string }
      },
    ),
  )

  // dump all env values to files
  await Promise.all(
    Object.entries(dockerComposeServices).map(async ([name, svc]) => {
      const serviceNXName = await mapServiceToNXname(name)
      await writeFile(
        join(rootDir, `.env.${serviceNXName}`),
        Object.entries(svc.env)
          .map(
            ([name, value]) =>
              `export ${name}='${value
                .replace(/'/g, "'\\''")
                .replace(/[\n\r]/g, '')}'`,
          )
          .join('\n'),
        { encoding: 'utf-8' },
      )
    }),
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
          } as MountebankConfig,
        ],
      }
    },
    { ports: [] as number[], configs: [] as MountebankConfig[] },
  )

  const baseDir = `${process.cwd()}/mountebank`
  const dataDir = `${baseDir}/data`
  const configDir = `${baseDir}/config`
  const configFile = `.baked.json`

  // Ensure directories are present
  mkdirSync(dataDir, { recursive: true, mode: 0o775 })
  mkdirSync(configDir, { recursive: true, mode: 0o775 })

  for (const config of mocksConfigs.configs) {
    await writeFile(
      `${configDir}/${config.name}.json`,
      JSON.stringify(config),
      {
        encoding: 'utf-8',
        mode: 0o664,
      },
    )
  }

  await writeFile(
    `${configDir}/.baked.json`,
    'INVALID\n' +
      JSON.stringify({
        imposters: [
          ...mocksConfigs.configs.map(
            (config) => `<%- include ${config.name}.json %>`,
          ),
          ...readdirSync(configDir)
            .filter((file) => file.endsWith('.js'))
            .map((file) => {
              try {
                console.log('file', file)
                const module = require(join(configDir, file))
                console.log('module', module)
                return JSON.stringify(module())
              } catch (e) {
                return {
                  name: file,
                  error: e,
                  message: 'Failed to load',
                }
              }
            }),

          // ...mocksConfigs.configs.map((config) => `include-${config.name}.json`),
          // ...readdirSync(configDir)
          //   .filter((file) => file.endsWith('.js'))
          //   .map((file) => `js-${file}`),
          // const fs = require('fs');
          //
          // const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
          //
          // JSON.stringify({
          //   imposters: [
          //     ...files.map(file => `include-${file.replace('.js', '')}`),
          //   ],
          // })
        ],
      })
        .replace(/"include-([^"]+)"/g, '<%- include $1 %>')
        .replace(/"js-([^"]+)"/g, '<%- include $1 %>')
        .replace(/"jsanchor"/g, '<% '),
    {
      encoding: 'utf-8',
      mode: 0o664,
    },
  )

  const mockPorts = mocksConfigs.ports
    .map((port) => `-p=${port}:${port}`)
    .join(' ')
  const mockMounts = [`${dataDir}:/app/.mbdb:z`, `${configDir}:/app/config:z`]
    .filter(Boolean)
    // Ensure z option is set, but don't overwrite other options
    .map((x) => {
      const [mountHost, mountGuest, options] = x.split(':')
      return `${mountHost}:${mountGuest}:${(options ?? '').replace(/z/g, '')}z`
    })
    // Prepend -v to mounts
    .map((x) => `-v=${x}`)
    .join(' ')
  const startOptions = [
    existsSync(`${configDir}/${configFile}`)
      ? `--configfile=config/${configFile}`
      : '',
    existsSync(dataDir) ? `--datadir=.mbdb/datadir` : '',
  ]
    .filter(Boolean)
    .join(' ')
  const mocks = [
    `docker run`,
    `--userns=keep-id:uid=1001,gid=1001`,
    `-it`,
    `--rm`,
    `--name=mountebank`,
    `-p=2525:2525`,
    `${mockPorts}`,
    `${mockMounts}`,
    `docker.io/bbyars/mountebank:2.8.1`,
    `start`,
    `${startOptions}`,
  ].join(' ')

  return {
    services: Object.entries(dockerComposeServices).reduce(
      (acc, [name, service]) => ({ ...acc, [name]: service.command }),
      {},
    ),
    mocks: mocks,
  }
}
