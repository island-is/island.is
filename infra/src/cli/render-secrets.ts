import { Envs } from '../environments'
import { Charts } from '../uber-charts/all-charts'
import { renderHelmServices } from '../dsl/exports/helm'
import { getSsmParams } from '../dsl/adapters/get-ssm-params'
import { escapeValue, serviceExists } from './utils'

const EXCLUDED_ENVIRONMENT_NAMES = [
  'DB_PASSWORD',
  'NOVA_USERNAME',
  'NOVA_PASSWORD',
]

const OVERRIDE_ENVIRONMENT_NAMES: Record<string, string> = {
  IDENTITY_SERVER_CLIENT_SECRET: '/k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET',
}

const SHARED_ENVIRONMENT_NAMES: Record<string, string> = {
  NX_CLOUD_ACCESS_TOKEN: '/local/NX_CLOUD_ACCESS_TOKEN',
}

export const renderSecretsCommand = async (service: string) => {
  return renderSecrets(service).catch((error) => {
    if (error.name === 'CredentialsProviderError') {
      console.error(
        'Could not load AWS credentials from any providers. Did you forget to configure environment variables, aws profile or run `aws sso login`?',
      )
    } else {
      console.error(error)
    }
    process.exit(1)
  })
}

export const renderSecrets = async (
  service: string,
): Promise<[string, string][]> => {
  if (!serviceExists(service, 'islandis', 'dev')) {
    console.error(
      `Service ${service} does not exist. Please check your spelling and try again.`,
    )
    return []
  }
  const services = await Promise.all(
    Object.values(Charts).map(
      async (chart) =>
        (await renderHelmServices(Envs.dev01, chart.dev, chart.dev, 'no-mocks'))
          .services,
    ),
  )

  const secretRequests: [string, string][] = services
    .map((svc) => {
      return Object.entries(svc)
        .map(([serviceName, config]) => {
          if (serviceName == service) {
            return Object.entries(config.secrets)
          }
          return []
        })
        .reduce((p, c) => p.concat(c), [])
    })
    .reduce((p, c) => p.concat(c), [])
    .filter(([envName]) => !EXCLUDED_ENVIRONMENT_NAMES.includes(envName))
    .map((request) => {
      const envName = request[0]
      const ssmName = OVERRIDE_ENVIRONMENT_NAMES[envName]
      if (ssmName) {
        return [envName, ssmName]
      }
      return request
    })
  const sharedRequests: [string, string][] = Object.entries(
    SHARED_ENVIRONMENT_NAMES,
  )
  const finalRequests = [...secretRequests, ...sharedRequests]
  const values = await getSsmParams(
    finalRequests.map(([_, ssmName]) => ssmName),
  )
  return finalRequests.map(([envName, ssmName]) => {
    const escapedValue = escapeValue(values[ssmName], ssmName)
    return [envName, escapedValue]
  })
}
