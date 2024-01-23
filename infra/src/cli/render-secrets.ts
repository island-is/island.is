import { Envs } from '../environments'
import { Charts } from '../uber-charts/all-charts'
import { renderHelmServices } from '../dsl/exports/helm'
import { getSsmParams } from '../dsl/adapters/get-ssm-params'
import { logger } from '../common'

const EXCLUDED_ENVIRONMENT_NAMES = [
  'DB_PASSWORD',
  'NOVA_USERNAME',
  'NOVA_PASSWORD',
]

const OVERRIDE_ENVIRONMENT_NAMES: Record<string, string> = {
  IDENTITY_SERVER_CLIENT_SECRET: '/k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET',
}

export const renderSecretsCommand = async (service: string) => {
  return renderSecrets(service).catch((error) => {
    if (error.name === 'CredentialsProviderError') {
      logger.error(
        'Could not load AWS credentials from any providers. Did you forget to configure environment variables, aws profile or run `aws sso login`?',
      )
    } else {
      logger.error(error)
    }
    return {} as ReturnType<typeof renderSecrets>
  })
}

export const renderSecrets = async (service: string) => {
  const services = await Promise.all(
    Object.values(Charts).map(
      async (chart) =>
        (
          await renderHelmServices(Envs.dev01, chart.dev, chart.dev, 'no-mocks')
        ).services,
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

  const values = await getSsmParams(
    secretRequests.map(([_, ssmName]) => ssmName),
  )
  const envMap = Object.fromEntries(
    secretRequests.map(([envName, ssmName]) => [envName, values[ssmName]]),
  )

  console.log('### envMap', envMap)
  Object.entries(envMap).forEach(([key, value]) => {
    const escapedValue = value.replace(/\n/g, '\\n').replace(/"/g, '\\"')
    logger.debug(`export ${key}='${escapedValue}'`)
  })
  return envMap
}
