import {
  LocalrunService,
  LocalrunValueFile,
  Services,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { EXCLUDED_ENVIRONMENT_NAMES } from '../../cli/render-env-vars'
import { readFile } from 'fs/promises'
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

export const getLocalSetup = async (
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
  const mocks: Services<LocalrunService> = Object.entries(runtime.mocks).reduce(
    (acc, [name, target]) => {
      if (name.startsWith('mock-')) {
        return {
          ...acc,
          [name]: {
            'proxy-port': runtime.ports[name],
            'mountebank-imposter-config': JSON.stringify({
              protocol: 'http',
              name: name,
              port: runtime.ports[name],
              stubs: [
                {
                  predicates: [{ equals: {} }],
                  responses: [
                    {
                      proxy: {
                        to: target,
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
            }),
          },
        }
      }
      return {
        ...acc,
      }
    },
    {},
  )

  return {
    services: { ...dockerComposeServices },
    mocks: mocks,
  }
}
