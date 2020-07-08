import { Answers, Schema } from '../types/Form'
import { FormNode } from '../types/FormTree'
import { getQuestionsForFormNode } from '../lib/formUtils'
import { ZodError } from 'zod'

export function areAnswersValid(
  answers: Answers,
  formNode: FormNode,
  partialValidation: boolean,
  dataSchema: Schema,
): ZodError {
  const questionMap = getQuestionsForFormNode(formNode)
  const questionsToCheck = {}
  Object.keys(partialValidation ? answers : questionMap).forEach((id) => {
    questionsToCheck[id] = true
  })

  const newSchema = dataSchema.pick(questionsToCheck)
  try {
    newSchema.parse(answers)
  } catch (error) {
    return error as ZodError
  }
  return undefined
}
