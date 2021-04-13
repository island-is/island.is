import { ZodError } from 'zod'
import isNumber from 'lodash/isNumber'
import { FieldErrors } from 'react-hook-form/dist/types/form'

import {
  FormatMessage,
  Schema,
  StaticText,
  StaticTextObject,
} from '../types/Form'
import { Answer, FormValue } from '../types/Application'
import { AnswerValidationError } from './AnswerValidator'
import { coreErrorMessages } from '../lib/messages'

export interface SchemaValidationError {
  [key: string]: string
}

function populateError(
  currentError: SchemaValidationError | undefined,
  newError: ZodError | undefined,
  pathToError: string,
  formatMessage: FormatMessage,
): SchemaValidationError | undefined {
  if (newError === undefined) {
    return currentError
  }

  // For generic errors we use a default message
  const translatedErrorMessage = {
    [pathToError]: formatMessage(coreErrorMessages.defaultError),
  }

  if (!currentError) {
    return translatedErrorMessage
  }

  let newErrorMessage = translatedErrorMessage

  // For custom error from namespaces' messages defined inside the dataSchema.ts file
  if (newError.errors[0].code === 'custom_error') {
    const namespaceRegex = /^\w*\.\w*:.*/g
    const includeNamespace = newError.errors[0]?.params?.id?.match(
      namespaceRegex,
    )?.[0]

    if (includeNamespace) {
      newErrorMessage = {
        [pathToError]: formatMessage(
          newError.errors[0].params as StaticTextObject,
        ),
      }
    }
  }

  return {
    ...currentError,
    ...newErrorMessage,
  }
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
  error: SchemaValidationError | undefined,
  currentPath = '',
  formatMessage: FormatMessage,
): SchemaValidationError | undefined {
  Object.keys(answers).forEach((key) => {
    const newPath = constructPath(currentPath, key)
    const answer = answers[key]

    // ZodUnions do not have .pick method
    const trimmedSchema = originalSchema.pick
      ? originalSchema.pick({ [key]: true })
      : originalSchema

    try {
      trimmedSchema.parse({ [key]: answer })
    } catch (e) {
      error = populateError(error, e, newPath, formatMessage)

      if (Array.isArray(answer)) {
        const arrayElements = answer as Answer[]

        arrayElements.forEach((el, index) => {
          try {
            trimmedSchema.parse({ [key]: [el] })
          } catch (e) {
            const elementPath = `${newPath}[${index}]`

            error = populateError(error, e, elementPath, formatMessage)

            if (el !== null && typeof el === 'object') {
              error = partialSchemaValidation(
                el as FormValue,
                trimmedSchema?.shape[key]?._def?.type,
                error,
                elementPath,
                formatMessage,
              )
            }
          }
        })
      } else if (typeof answer === 'object') {
        error = partialSchemaValidation(
          answer as FormValue,
          originalSchema.shape[key],
          error,
          newPath,
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
}): SchemaValidationError | FieldErrors<FormValue> | undefined {
  // This returns a custom error message object of SchemaValidationError type
  if (!isFullSchemaValidation) {
    return partialSchemaValidation(
      answers,
      dataSchema,
      undefined,
      '',
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
): ((message: StaticText, field?: string) => AnswerValidationError) => (
  message,
  field,
) => {
  if (field && isNumber(index)) {
    return {
      message,
      path: `${path}[${index}].${field}`,
    }
  }

  return {
    message,
    path,
  }
}
