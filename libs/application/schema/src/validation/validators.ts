import { FormValue, Schema } from '../types/Form'
import { FormNode } from '../types/FormTree'
import { getQuestionsForFormNode } from '../lib/formUtils'
import * as z from 'zod'

export function extractPartialSchemaForValues(
  schema: Schema,
  values: FormValue,
): Schema {
  let returnSchema = z.object({})
  Object.keys(values).forEach((key) => {
    const value = values[key]

    if (typeof value === 'object') {
      if (value.length) {
        returnSchema = returnSchema.merge(schema.pick({ [key]: true }))
      } else {
        returnSchema = returnSchema.merge(
          z.object({
            [key]: extractPartialSchemaForValues(
              schema.shape[key],
              value as FormValue,
            ),
          }),
        )
      }
    } else {
      returnSchema = returnSchema.merge(schema.pick({ [key]: true }))
    }
  })
  return returnSchema
}

export function areAnswersValid(
  answers: FormValue,
  formNode: FormNode,
  partialValidation: boolean,
  dataSchema: Schema,
): z.ZodError {
  if (partialValidation) {
    const newSchema = extractPartialSchemaForValues(dataSchema, answers)
    try {
      newSchema.parse(answers)
    } catch (e) {
      return e
    }
    return undefined
  }

  const questionsToCheck = {}
  Object.keys(getQuestionsForFormNode(formNode)).forEach((id) => {
    questionsToCheck[id] = true
  })

  const newSchema = dataSchema.pick(questionsToCheck)
  try {
    newSchema.parse(answers)
  } catch (e) {
    return e
  }
  return undefined
}
