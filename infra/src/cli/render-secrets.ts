import { generateYamlForEnv } from '../dsl/serialize-to-yaml'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import { charts } from '../uber-charts/all-charts'
import { SSM } from 'aws-sdk'
import { GetParametersByPathResult } from 'aws-sdk/clients/ssm'

const API_INITIALIZATION_OPTIONS = {
  region: 'eu-west-1',
  maxRetries: 10,
  retryDelayOptions: { base: 200 },
}

const client = new SSM(API_INITIALIZATION_OPTIONS)

export const renderSecrets = async (service: string) => {
  const urls: string[] = []
  const uberChart = new UberChart(Envs.dev)
  const services = Object.values(charts).map(
    (chart) => generateYamlForEnv(uberChart, ...chart.dev).services,
  )

  const allDevParamNames = await getAllDevParams()

  services.forEach((svc) => {
    Object.entries(svc).forEach(([serviceName, config]) => {
      if (serviceName == service) {
        Object.entries(config.secrets).forEach(([envName, ssmName]) => {
          if (allDevParamNames[ssmName]) {
            console.log(`export ${envName}=${allDevParamNames[ssmName]}`)
          }
        })
      }
    })
  })
}

const getAllDevParams = async (): Promise<{ [name: string]: string }> => {
  const names: { [name: string]: string } = {}
  let nextToken
  do {
    const response: GetParametersByPathResult = await client
      .getParametersByPath({
        NextToken: nextToken,
        MaxResults: 10,
        ParameterFilters: [{ Key: 'Label', Values: ['dev'], Option: 'Equals' }],
        Path: '/k8s',
        Recursive: true,
        WithDecryption: true,
      })
      .promise()
    nextToken = response.NextToken
    response.Parameters?.forEach((param) => {
      if (param.Name) {
        names[param.Name] = param.Value!
      }
    })
  } while (nextToken)
  return names
}
