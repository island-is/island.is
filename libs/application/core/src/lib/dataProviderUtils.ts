import { Application } from '../types/Application'
import {
  DataProviderResult,
  ProviderErrorReason,
} from '../types/DataProviderResult'
import {
  BasicDataProvider,
  CustomTemplateFindQuery,
} from '../types/BasicDataProvider'
import { StaticText } from '../types/Form'
import { coreErrorMessages } from './messages'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import { FormatMessage } from '../types/external'

export const isTranslationObject = (text?: StaticText) => {
  if (!isObject(text)) {
    return false
  }

  return text.id !== undefined
}

export const isProviderErrorReason = (
  reason: ProviderErrorReason | StaticText,
): reason is ProviderErrorReason => {
  if (typeof reason === 'string' || reason instanceof String) {
    return false
  }
  if (
    isObject(reason) &&
    'title' in reason &&
    'summary' in reason &&
    reason.title !== '' &&
    reason.summary !== ''
  ) {
    return true
  }
  return false
}

export const getErrorReasonIfPresent = (
  reason: ProviderErrorReason | StaticText | undefined,
) => {
  if (reason) {
    if (isProviderErrorReason(reason)) {
      return {
        title: reason.title,
        summary: reason.summary,
      }
    }
    if (isTranslationObject(reason) || isString(reason)) {
      return {
        title: coreErrorMessages.errorDataProvider,
        summary: reason,
      }
    }
  }
  return {
    title: coreErrorMessages.errorDataProvider,
    summary: coreErrorMessages.failedDataProvider,
  }
}

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
      const { title, summary } = getErrorReasonIfPresent(error.reason)
      return Promise.resolve(
        provider.onProvideError({
          ...error,
          ...{
            summary: isTranslationObject(summary)
              ? formatMessage(summary)
              : summary,
            title: isTranslationObject(title) ? formatMessage(title) : title,
          },
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
