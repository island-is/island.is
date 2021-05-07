import { Application } from '../types/Application'
import { DataProviderResult } from '../types/DataProviderResult'
import {
  BasicDataProvider,
  CustomTemplateFindQuery,
} from '../types/BasicDataProvider'

export interface FulfilledPromise<T> {
  status: 'fulfilled'
  value: T
}

function callProvider(
  provider: BasicDataProvider,
  application: Application,
  customTemplateFindQuery: CustomTemplateFindQuery,
): Promise<DataProviderResult> {
  if (provider === null) {
    return Promise.resolve({
      date: new Date(),
      status: 'failure',
      reason: 'unable to build provider',
    })
  }
  return provider.provide(application, customTemplateFindQuery).then(
    (result) => {
      return Promise.resolve(provider.onProvideSuccess(result))
    },
    (error) => {
      return Promise.resolve(provider.onProvideError(error))
    },
  )
}

export async function callDataProviders(
  dataProviders: BasicDataProvider[],
  application: Application,
  customTemplateFindQuery: CustomTemplateFindQuery,
): Promise<DataProviderResult[]> {
  // TODO what about options to pass to each data provider?
  const promises = dataProviders.map((p) =>
    Promise.resolve(callProvider(p, application, customTemplateFindQuery)),
  )
  return Promise.all(promises)
}
