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
      reason: 'unable to build provider',
    })
  }
  return provider.provide(application, customTemplateFindQuery).then(
    (result) => {
      return Promise.resolve(provider.onProvideSuccess(result))
    },
    (error) => {
      if (
        error.reason &&
        error.reason === 'object' &&
        ((!('title' in error.reason) && 'summary' in error.reason) ||
          ('title' in error.reason && !('summary' in error.reason)))
      ) {
        throw new TypeError(
          'Must supply title and summary or just reason string when defining a reason object',
        )
      }

      const reason =
        typeof error.reason === 'object'
          ? 'title' in error.reason && 'summary' in error.reason
            ? {
                title: formatMessage(error.reason.title),
                summary: formatMessage(error.reason.summary),
              }
            : formatMessage(error.reason)
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
