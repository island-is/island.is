import {
  LocalrunService,
  LocalrunValueFile,
  Services,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { excludeNonLocalEnvWithService } from '../../cli/render-env-vars'
import { readFile, writeFile } from 'fs/promises'
import { globSync } from 'glob'
import { join } from 'path'
import { rootDir } from '../consts'

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
              .filter(excludeNonLocalEnvWithService(serviceNXName))
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
    )} -v ${process.cwd()}/${defaultMountebankConfig}:/app/default.json docker.io/bbyars/mountebank:2.8.1 start --configfile=/app/default.json`

  return {
    services: Object.entries(dockerComposeServices).reduce(
      (acc, [name, service]) => ({ ...acc, [name]: service.command }),
      {},
    ),
    mocks: mocks,
  }
}
