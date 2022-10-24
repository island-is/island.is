import { YES } from '../constants'

export const hasYes = (answer: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }

  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }

  return answer === YES
}
