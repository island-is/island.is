import { ZodIssue } from 'zod/lib/ZodError'
import isNumber from 'lodash/isNumber'
import has from 'lodash/has'
import set from 'lodash/set'
import merge from 'lodash/merge'

import {
  Schema,
  StaticText,
  StaticTextObject,
  ValidationRecord,
  FormatMessage,
  FormValue,
  RecordObject,
} from '@island.is/application/types'
import { coreErrorMessages } from '../lib/messages'
import { AnswerValidationError } from './AnswerValidator'

function populateError(
  currentError: ValidationRecord = {},
  newError: ZodIssue[],
  pathToError: string | undefined,
  formatMessage: FormatMessage,
) {
  let errorObject = {}
  const defaultZodError = newError[0].message === 'Invalid input'

  newError.forEach((element) => {
    const path = pathToError || element.path
    let message = formatMessage(coreErrorMessages.defaultError)
    if (element.code === 'custom') {
      const namespaceRegex = /^\w*\.\w*:.*/g
      const includeNamespace = element?.params?.id?.match(namespaceRegex)?.[0]

      if (includeNamespace) {
        message = formatMessage(element.params as StaticTextObject)
      } else if (!defaultZodError) {
        message = element.message
      }
    }

    errorObject = set(errorObject, path, message)
  })

  return merge(currentError, errorObject)
}

function constructPath(currentPath: string, newKey: string) {
  if (currentPath === '') {
    return newKey
  }

  return `${currentPath}.${newKey}`
}

function partialSchemaValidation(
  answers: FormValue,
  originalSchema: Schema,
  error: ValidationRecord | undefined,
  currentPath = '',
  sendConstructedPath: boolean,
  formatMessage: FormatMessage,
): ValidationRecord | undefined {
  Object.keys(answers ?? {}).forEach((key) => {
    const constructedErrorPath = constructPath(currentPath, key)
    const answer = answers[key]

    // ZodUnions do not have .pick method
    const trimmedSchema = originalSchema?.pick
      ? originalSchema.pick({ [key]: true })
      : originalSchema

    try {
      trimmedSchema.parse({ [key]: answer })
    } catch (e) {
      const zodErrors: ZodIssue[] = e.errors

      if (!has(error, constructedErrorPath)) {
        error = populateError(
          error,
          zodErrors,
          sendConstructedPath ? constructedErrorPath : undefined,
          formatMessage,
        )
      }
    }
  })
  return error
}

export function validateAnswers({
  dataSchema,
  answers,
  isFullSchemaValidation,
  formatMessage,
}: {
  dataSchema: Schema
  answers: FormValue
  isFullSchemaValidation?: boolean
  formatMessage: FormatMessage
}): ValidationRecord | undefined {
  if (!isFullSchemaValidation) {
    return partialSchemaValidation(
      answers,
      dataSchema,
      undefined,
      '',
      false,
      formatMessage,
    )
  }

  // This returns FieldsErrors<FormValue> the correct return type from the resolver
  try {
    dataSchema.parse(answers)
  } catch (e) {
    return e
  }

  return undefined
}

export const buildValidationError = (
  path: string,
  index?: number,
): ((
  message: StaticText,
  field?: string,
  values?: RecordObject<unknown>,
) => AnswerValidationError) => (message, field, values) => {
  if (field && isNumber(index)) {
    return {
      message,
      path: `${path}[${index}].${field}`,
      values,
    }
  }

  return {
    message,
    path,
    values,
  }
}
