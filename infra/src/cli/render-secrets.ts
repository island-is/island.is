import { generateYamlForEnv } from '../dsl/serialize-to-yaml'
import { UberChart } from '../dsl/uber-chart'
import { Envs } from '../environments'
import { charts } from '../uber-charts/all-charts'
import { SSM, ResourceGroupsTaggingAPI } from 'aws-sdk'
import { GetResourcesOutput } from 'aws-sdk/clients/resourcegroupstaggingapi'

const API_INITIALIZATION_OPTIONS = {
  region: 'eu-west-1',
  maxRetries: 10,
  retryDelayOptions: { base: 200 },
}

export const renderSecrets = async (service: string) => {
  const client = new SSM(API_INITIALIZATION_OPTIONS)

  const urls: string[] = []
  const uberChart = new UberChart(Envs.dev)
  const services = Object.values(charts).map(
    (chart) => generateYamlForEnv(uberChart, ...chart.dev).services,
  )
  const secretMap: { [name: string]: string } = {}
  services.forEach((svc) => {
    Object.entries(svc).forEach(([serviceName, config]) => {
      if (serviceName == service) {
        Object.entries(config.secrets).forEach(([envName, ssmName]) => {
          secretMap[ssmName] = envName
        })
      }
    })
  })
  // There seem to be only 1 parameter that's labeled as dev?
  // const allDevParamNames = await getAllDevParamsNames()
  // const ssmNames = Object.keys(secretMap).filter((ssmName) =>
  //   allDevParamNames.includes(ssmName),
  // )
  const ssmNames = Object.keys(secretMap)
  while (ssmNames.length) {
    const params = await client
      .getParameters({ Names: ssmNames.splice(0, 10), WithDecryption: true })
      .promise()
    if (params.Parameters) {
      params.Parameters.forEach((p) => {
        if (p.Name) {
          console.log(`export ${secretMap[p.Name]}=${p.Value}`)
        }
      })
    } else {
      throw new Error('params.Parameters aws undefined?')
    }
    return
  }
}

const getAllDevParamsNames = async (): Promise<string[]> => {
  const client = new ResourceGroupsTaggingAPI(API_INITIALIZATION_OPTIONS)
  const names = []
  let nextToken
  do {
    const response: GetResourcesOutput = await client
      .getResources({
        PaginationToken: nextToken,
        ResourcesPerPage: 100,
        TagFilters: [{ Key: 'Label', Values: ['dev'] }],
      })
      .promise()
    nextToken = response.PaginationToken
    names.push(
      ...response.ResourceTagMappingList!.map(({ ResourceARN }) =>
        ResourceARN
          ? ResourceARN.split(':')
              .slice(-1)
              .pop()!
              .replace(/^parameter\/\/?/, '/')
          : '',
      ),
    )
  } while (nextToken)
  return names
}
