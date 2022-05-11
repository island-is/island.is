import { Application } from '../types/Application'
import { DataProviderResult } from '../types/DataProviderResult'
import {
  BasicDataProvider,
  CustomTemplateFindQuery,
} from '../types/BasicDataProvider'
import { FormatMessage } from '../types/Form'

export interface FulfilledPromise<T> {
  status: 'fulfilled'
  value: T
}

function callProvider(
  provider: BasicDataProvider,
  application: Application,
  customTemplateFindQuery: CustomTemplateFindQuery,
  formatMessage: FormatMessage,
): Promise<DataProviderResult> {
  if (provider === null) {
    return Promise.resolve({
      date: new Date(),
      status: 'failure',
      reason: { summary: 'unable to build provider' },
    })
  }
  return provider.provide(application, customTemplateFindQuery).then(
    (result) => {
      return Promise.resolve(provider.onProvideSuccess(result))
    },
    (error) => {
      console.log({ error })
      const reason =
        typeof error.reason === 'object'
          ? {
              title: formatMessage(error.reason.title),
              summary: formatMessage(error.reason.summary),
            }
          : error.reason

      return Promise.resolve(
        provider.onProvideError({
          ...error,
          reason,
        }),
      )
    },
  )
}

export async function callDataProviders(
  dataProviders: BasicDataProvider[],
  application: Application,
  customTemplateFindQuery: CustomTemplateFindQuery,
  formatMessage: FormatMessage,
): Promise<DataProviderResult[]> {
  // TODO what about options to pass to each data provider?
  const promises = dataProviders.map((p) =>
    Promise.resolve(
      callProvider(p, application, customTemplateFindQuery, formatMessage),
    ),
  )
  return Promise.all(promises)
}
