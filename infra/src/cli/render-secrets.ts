import { Kubernetes } from '../dsl/kubernetes-runtime'
import { Envs } from '../environments'
import { Charts } from '../uber-charts/all-charts'
import { renderHelmServices } from '../dsl/exports/exports'
import { toServices } from '../dsl/exports/to-services'
import { getParams } from '../dsl/adapters/get-params'

const EXCLUDED_ENVIRONMENT_NAMES = [
  'DB_PASSWORD',
  'NOVA_USERNAME',
  'NOVA_PASSWORD',
]

const OVERRIDE_ENVIRONMENT_NAMES: Record<string, string> = {
  IDENTITY_SERVER_CLIENT_SECRET: '/k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET',
}

export const renderSecretsCommand = async (service: string) => {
  renderSecrets(service).catch((error) => {
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

export const renderSecrets = async (service: string) => {
  const urls: string[] = []
  const uberChart = new Kubernetes(Envs.dev01)
  const services = await Promise.all(
    Object.values(Charts).map(
      async (chart) =>
        (await renderHelmServices(uberChart.env, toServices(chart.dev)))
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

  const values = await getParams(secretRequests.map(([_, ssmName]) => ssmName))

  secretRequests.forEach(([envName, ssmName]) => {
    const escapedValue = values[ssmName]
      .replace(/\s+/g, ' ')
      .replace(/'/g, "'\\''")
    console.log(`export ${envName}='${escapedValue}'`)
  })
}
