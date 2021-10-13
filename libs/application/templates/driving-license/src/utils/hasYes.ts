import { Answer } from '@island.is/application/core'
import { YES } from '../lib/constants'

export const hasYes = (answer: Answer) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }

  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }

  return answer === YES
}
