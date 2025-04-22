import { RelationEnum, EstateMember } from '../../types'
import {
  Application,
  FormValue,
  StaticText,
} from '@island.is/application/types'
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
  answers: FormValue,
  recipient?: string,
): string => {
  if (!recipient) {
    return ''
  }
  const estateMembers = getValueViaPath<Array<EstateMember>>(
    answers,
    'estateMembers.members',
  )

  const estateMember = estateMembers?.find(
    (member) => member.nationalId === recipient,
  )
  return estateMember?.name || answers.applicantName.toString()
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

export const showInDone = (answers: FormValue) => {
  const viewOverview = getValueViaPath<boolean>(answers, 'viewOverview')
  return viewOverview === true || viewOverview === undefined
}

export const estateMemberAndShowInDone = (answers: FormValue) => {
  const members =
    getValueViaPath<Array<EstateMember>>(answers, 'estateMembers.members') ?? []
  return members?.length > 0 && showInDone(answers)
}

export const showInDoneAndHadFirearms = (answers: FormValue) => {
  const hadFirearms = getValueViaPath<string>(answers, 'hadFirearms')
  return showInDone(answers) && hadFirearms === YES
}
