import { Answer } from '@island.is/application/types'
import { YES } from '../constants'

export const hasYes = (answer: Answer) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }

  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }

  return answer === YES
}
