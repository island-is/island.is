import { RelationEnum, Answers } from '../../types'
import { Answer } from '@island.is/application/core'
import { YES } from '../constants'

export const getRelationOptions = (): Record<
  keyof typeof RelationEnum,
  string
> => {
  return {
    SPOUSE: 'Maki',
    CHILD: 'Barn',
    PARENT: 'Foreldri',
    SIBLING: 'Systkini',
  }
}

export const getFileRecipientName = (
  answers: Answers,
  recipient?: string,
): string => {
  if (!recipient) {
    return ''
  }
  const { estateMembers } = answers
  const estateMember = estateMembers?.find(
    (estateMember) => estateMember.nationalId === recipient,
  )
  return estateMember?.name || answers.applicantName.toString()
}

export const hasYes = (answer: any) => {
  if (Array.isArray(answer)) {
    return answer.includes(YES)
  }

  if (answer instanceof Object) {
    return Object.values(answer).includes(YES)
  }

  return answer === YES
}
