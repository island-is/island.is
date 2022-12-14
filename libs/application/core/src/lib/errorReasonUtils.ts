import { coreErrorMessages } from './messages'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import { StaticText } from '@island.is/application/types'
import { ProviderErrorReason } from '@island.is/shared/problem'

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
        title: coreErrorMessages.failedDataProviderSubmit,
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
