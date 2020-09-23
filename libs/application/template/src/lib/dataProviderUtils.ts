import { Application } from '../types/Application'
import { DataProviderResult } from '../types/DataProviderResult'
import { DataProvider } from '../types/DataProvider'

export interface FulfilledPromise<T> {
  status: 'fulfilled'
  value: T
}

function callProvider(
  provider: DataProvider,
  application: Application,
): Promise<DataProviderResult> {
  if (provider === null) {
    return Promise.resolve({
      date: new Date(),
      status: 'failure',
      reason: 'unable to build provider',
    })
  }
  return provider.provide(application).then(
    (result) => {
      return Promise.resolve(provider.onProvideSuccess(result))
    },
    (error) => {
      return Promise.resolve(provider.onProvideError(error))
    },
  )
}

export async function callDataProviders(
  dataProviders: DataProvider[],
  application: Application,
): Promise<DataProviderResult[]> {
  // TODO what about options to pass to each data provider?
  const promises = dataProviders.map((p) =>
    Promise.resolve(callProvider(p, application)),
  )
  return Promise.all(promises)
}
