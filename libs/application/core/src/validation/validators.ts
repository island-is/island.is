import isNumber from 'lodash/isNumber'
import set from 'lodash/set'
import { ZodEffects, ZodIssueCode, ZodIssue } from 'zod'

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
  error: ZodIssue[],
  pathToError: string | undefined,
  formatMessage: FormatMessage,
) {
  let errorObject = {}
  error.forEach((element) => {
    const isDefaultZodError = element.message === 'Invalid input'
    const path = pathToError || element.path
    let message = formatMessage(coreErrorMessages.defaultError)

    if (!isDefaultZodError) {
      message = formatMessage(element.message)
    }

    if (element.code === ZodIssueCode.custom) {
      const namespaceRegex = /^\w*\.\w*:.*/g
      const includeNamespace = element?.params?.id?.match(namespaceRegex)?.[0]

      if (includeNamespace) {
        message = formatMessage(element.params as StaticTextObject)
      }
    }
    errorObject = set(errorObject, path, message)
  })
  return errorObject
}

export function validateAnswers({
  dataSchema,
  answers,
  formatMessage,
}: {
  dataSchema: Schema | ZodEffects<any, any, any>
  answers: FormValue
  isFullSchemaValidation?: boolean
  formatMessage: FormatMessage
}): ValidationRecord | undefined {
  try {
    if (dataSchema instanceof ZodEffects) {
      // cases where zod schema has a refinement on the schema object, needs to be defined partial
      dataSchema.parse(answers)
    } else {
      // all schemas set as partials as we dont validate until a value is entered
      dataSchema.partial().parse(answers)
    }
  } catch (e) {
    const zodErrors: ZodIssue[] = e.errors
    return populateError(zodErrors, e.path, formatMessage)
  }
  return undefined
}

export const buildValidationError =
  (
    path: string,
    index?: number,
  ): ((
    message: StaticText,
    field?: string,
    values?: RecordObject<unknown>,
  ) => AnswerValidationError) =>
  (message, field, values) => {
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
