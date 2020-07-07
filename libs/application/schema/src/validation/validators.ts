import { Answers, Answer, ValidationError } from '../types/form'
import { Question } from '../types/fields'
import { FormNode } from '../types/form-tree'
import { getQuestionsForFormNode } from '../lib/schema-utils'

export function hasValue(value): boolean {
  const isNotNull = value !== null
  const isNotUndefined = value !== undefined
  const isNotEmptyString = value !== ''

  if (typeof value === 'object') {
    if (value instanceof Array) {
      return value.length > 0
    }
  }

  return isNotNull && isNotUndefined && isNotEmptyString
}

const isRequired = (answer: Answer, question: Question): ValidationError => {
  if (!question.required) {
    return {}
  }
  if (hasValue(answer)) {
    return {}
  }
  return {
    [question.id]: {
      type: 'required',
      message: '',
      value: answer,
    },
  }
}

export function areAnswersValid(
  answers: Answers,
  formNode: FormNode,
): ValidationError {
  const questionMap = getQuestionsForFormNode(formNode)
  const questionIds = Object.keys(questionMap)

  let errors: ValidationError = {}

  questionIds.forEach((questionId) => {
    const question = questionMap[questionId]
    const answer = answers[questionId]

    errors = { ...errors, ...isRequired(answer, question) }
  })

  return errors
}
