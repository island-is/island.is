import { RelationEnum, Answers } from '../../types'
import { Application, StaticText } from '@island.is/application/types'
import { getValueViaPath, YES } from '@island.is/application/core'
import { m } from '../messages'

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
  const estateMember = estateMembers?.members.find(
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

export const determineMessageFromApplicationAnswers = (
  application: Application,
): StaticText => {
  const name = getValueViaPath(
    application.externalData,
    'syslumennOnEntry.data.estate.nameOfDeceased',
    '',
  ) as string
  return `${m.applicationTitle.defaultMessage} ${name}`
}
