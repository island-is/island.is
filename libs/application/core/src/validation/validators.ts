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

const populateError = (
  error: ZodIssue[],
  pathToError: string | undefined,
  formatMessage: FormatMessage,
  currentScreenFields?: string[],
) => {
  let errorObject: Record<string, string> = {}

  error.forEach((element) => {
    const defaultZodError = element.message === 'Invalid input'
    const path = pathToError || element.path
    let message = formatMessage(coreErrorMessages.defaultError)
    if (element.code === ZodIssueCode.custom) {
      const namespaceRegex = /^[\w.]+:\w+(\.\w+)*$/g
      const includeNamespace = element?.params?.id?.match(namespaceRegex)?.[0]
      if (includeNamespace) {
        const staticTextObject = element.params as StaticTextObject
        if (staticTextObject.values) {
          message = formatMessage(staticTextObject, staticTextObject.values)
        } else {
          message = formatMessage(staticTextObject)
        }
      } else if (!defaultZodError) {
        message = element.message
      }
    }
    errorObject = set(errorObject, path, message)
  })

  /**
   * If currentScreenFields is provided, only return errors for fields on that screen.
   * This is to avoid bugs in some scenarios (f.x. when going back via the browser back button)
   * Zod tries to validate screens that are not currently active, causing the user to not
   * be able to submit the screen.
   */
  if (currentScreenFields && currentScreenFields.length > 0) {
    // If we have nested fields, we need to resolve only the top level field
    const resolvedNestedFields = currentScreenFields.map(
      (id) => id.split('.')[0],
    )
    const relevantErrors = Object.fromEntries(
      Object.entries(errorObject).filter(([key]) =>
        resolvedNestedFields.includes(key),
      ),
    )

    if (Object.keys(relevantErrors).length === 0) {
      // No errors on the current screen
      return undefined
    }

    // log to help with debug
    console.info(relevantErrors)

    return relevantErrors
  }

  // log to help with debug
  console.info(errorObject)

  return errorObject
}

export const validateAnswers = ({
  dataSchema,
  answers,
  formatMessage,
  currentScreenFields,
}: {
  dataSchema: Schema | ZodEffects<any, any, any>
  answers: FormValue
  isFullSchemaValidation?: boolean
  formatMessage: FormatMessage
  currentScreenFields?: string[]
}): ValidationRecord | undefined => {
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
    return populateError(zodErrors, e.path, formatMessage, currentScreenFields)
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
