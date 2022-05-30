import { Application } from '@island.is/application/core'
import { RelationEnum, EstateMember, Answers } from '../../types'

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
