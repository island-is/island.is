import { generateYamlForEnv } from '../dsl/serialize-to-yaml'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import { charts } from '../uber-charts/all-charts'
import { SSM } from '@aws-sdk/client-ssm'

const API_INITIALIZATION_OPTIONS = {
  region: 'eu-west-1',
  maxAttempts: 10,
}

const EXCLUDED_ENVIRONMENT_NAMES = [
  'DB_PASSWORD',
  'NOVA_USERNAME',
  'NOVA_PASSWORD',
]

const OVERRIDE_ENVIRONMENT_NAMES: Record<string, string> = {
  IDENTITY_SERVER_CLIENT_SECRET: '/k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET',
}

const client = new SSM(API_INITIALIZATION_OPTIONS)

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
  const uberChart = new UberChart(Envs.dev)
  const services = Object.values(charts).map(
    (chart) => generateYamlForEnv(uberChart, ...chart.dev).services,
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
    console.log(`export ${envName}=${values[ssmName]}`)
  })
}

const getParams = async (
  ssmNames: string[],
): Promise<{ [name: string]: string }> => {
  const chunks = ssmNames.reduce((all: string[][], one: string, i: number) => {
    const ch = Math.floor(i / 10)
    all[ch] = ([] as string[]).concat(all[ch] || [], one)
    return all
  }, [])

  const allParams = await Promise.all(
    chunks.map((Names) =>
      client.getParameters({ Names, WithDecryption: true }),
    ),
  )
  return allParams
    .map(({ Parameters }) =>
      Object.fromEntries(Parameters!.map((p) => [p.Name, p.Value])),
    )
    .reduce((p, c) => ({ ...p, ...c }), {})
}
