import {
  DataProvider,
  DataProviderResult,
  ProviderParams,
} from './DataProvider'

export interface FulfilledPromise<T> {
  status: 'fulfilled'
  value: T
}

function callProvider(
  provider: DataProvider,
  options: ProviderParams,
): Promise<DataProviderResult> {
  return provider.provide(options).then(
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
): Promise<DataProviderResult[]> {
  // TODO what about options to pass to each data provider?
  const promises = dataProviders.map((p) =>
    Promise.resolve(callProvider(p, {})),
  )
  return Promise.all(promises)
}
