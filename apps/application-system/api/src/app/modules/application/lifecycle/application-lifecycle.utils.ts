import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  PruningApplication,
  RecordObject,
} from '@island.is/application/types'
import addMilliseconds from 'date-fns/addMilliseconds'

const setValueViaPath = (obj: RecordObject, path: string, value: unknown) => {
  const keys = path.split('.')
  keys.reduce<RecordObject>((acc, key, i) => {
    if (i === keys.length - 1) {
      acc[key] = value
    } else {
      if (typeof acc[key] !== 'object' || acc[key] === null) {
        acc[key] = {}
      }
      return acc[key] as RecordObject
    }
    return acc
  }, obj)
}

export const getAdminDataAnswers = (
  answers: FormValue,
  fieldKeys: string[],
): RecordObject => {
  const result: RecordObject = {}

  for (const fieldKey of fieldKeys) {
    const value = getValueViaPath(answers, fieldKey)
    if (value !== undefined) {
      setValueViaPath(result, fieldKey, value)
    }
  }

  return result
}

export const getAdminDataExternalData = (
  externalData: ExternalData,
  fieldKeys: string[],
): RecordObject => {
  const result: RecordObject = {}

  for (const fieldKey of fieldKeys) {
    const value = getValueViaPath(externalData, fieldKey)
    if (value !== undefined) {
      setValueViaPath(result, fieldKey, value)
    }
  }

  return result
}

export const getPostPruneAtDate = (
  whenToPostPrune: number | ((application: PruningApplication) => Date),
  application: PruningApplication,
) => {
  return typeof whenToPostPrune === 'function'
    ? whenToPostPrune(application)
    : addMilliseconds(new Date(), whenToPostPrune)
}
