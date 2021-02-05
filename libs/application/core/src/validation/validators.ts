import { Schema } from '../types/Form'
import { Answer, FormValue } from '../types/Application'
import { ZodError } from 'zod'

interface SchemaValidationError {
  [key: string]: string
}

function populateError(
  currentError: SchemaValidationError | undefined,
  newError: ZodError | undefined,
  pathToError: string,
): SchemaValidationError | undefined {
  if (newError === undefined) {
    return currentError
  }

  if (!currentError) {
    return { [pathToError]: newError.errors[0].message }
  }

  return { ...currentError, [pathToError]: newError.errors[0].message }
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
      error = populateError(error, e, newPath)

      if (Array.isArray(answer)) {
        // handle array
        const arrayElements = answer as Answer[]
        arrayElements.forEach((el, index) => {
          const elementPath = `${newPath}[${index}]`
          if (el !== null && typeof el === 'object') {
            error = partialSchemaValidation(
              el as FormValue,
              trimmedSchema?.shape[key]?._def?.type,
              error,
              elementPath,
            )
          }
          try {
            trimmedSchema.parse({ [key]: [el] })
          } catch (e) {
            error = populateError(error, e, elementPath)
          }
        })
      }

      else if (typeof answer === 'object') {
        error = partialSchemaValidation(
          answer as FormValue,
          originalSchema.shape[key],
          error,
          newPath,
        )
      }
    }
  })

  return error
}

export function validateAnswers(
  dataSchema: Schema,
  answers: FormValue,
  isFullSchemaValidation?: boolean,
): SchemaValidationError | undefined {
  if (!isFullSchemaValidation) {
    return partialSchemaValidation(answers, dataSchema, undefined)
  }

  try {
    dataSchema.parse(answers)
  } catch (e) {
    return e
  }
  return undefined
}
