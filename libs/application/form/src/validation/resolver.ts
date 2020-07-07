import {
  Answers,
  areAnswersValid,
  FormNode,
} from '@island.is/application/schema'

// example for our own validation
export const resolver = (formNode: FormNode) => async (answers: Answers) => {
  const validationError = areAnswersValid(answers, formNode)

  const faultyQuestionIds = Object.keys(validationError)
  const values = {}
  const errors = {}
  faultyQuestionIds.forEach((questionId) => {
    const validation = validationError[questionId]
    values[questionId] = validationError.value
    errors[questionId] = { type: validation.type, message: validation.message }
  })

  return {
    values,
    errors,
  }
}
