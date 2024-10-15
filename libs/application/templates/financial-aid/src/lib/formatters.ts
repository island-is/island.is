import {
  Employment,
  HomeCircumstances,
  KeyMapping,
  FamilyStatus,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { Colors } from '@island.is/island-ui/theme'

import { MessageDescriptor } from 'react-intl'
import format from 'date-fns/format'

import * as m from './messages'
import { Routes } from './constants'
import { ApproveOptions } from './types'
import { findFamilyStatus } from './utils'
import {
  ExternalData,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { AnswersSchema } from './dataSchema'
import { getValueViaPath } from '@island.is/application/core'

export const getMessageHomeCircumstances: KeyMapping<
  HomeCircumstances,
  MessageDescriptor
> = {
  WithParents: m.homeCircumstancesForm.circumstances.withParents,
  Other: m.homeCircumstancesForm.circumstances.other,
  Unknown: m.homeCircumstancesForm.circumstances.other,
  OwnPlace: m.homeCircumstancesForm.circumstances.ownPlace,
  RegisteredLease: m.homeCircumstancesForm.circumstances.registeredLease,
  UnregisteredLease: m.homeCircumstancesForm.circumstances.unregisteredLease,
  WithOthers: m.homeCircumstancesForm.circumstances.withOthers,
}

export const getMessageEmploymentStatus: KeyMapping<
  Employment,
  MessageDescriptor
> = {
  Working: m.employmentForm.employment.working,
  Unemployed: m.employmentForm.employment.unemployed,
  CannotWork: m.employmentForm.employment.cannotWork,
  Other: m.employmentForm.employment.other,
}

export const getMessageFamilyStatus: KeyMapping<
  FamilyStatus,
  MessageDescriptor
> = {
  Cohabitation: m.familystatus.cohabitation,
  Married: m.familystatus.married,
  MarriedNotLivingTogether: m.familystatus.marriedNotLivingTogether,
  UnregisteredCohabitation: m.familystatus.unregisteredCohabitation,
  NotCohabitation: m.familystatus.notCohabitation,
}

export const getMessageApproveOptions: KeyMapping<
  ApproveOptions,
  MessageDescriptor
> = {
  Yes: m.approveOptions.yes,
  No: m.approveOptions.no,
}

export const getMessageApproveOptionsForIncome: KeyMapping<
  ApproveOptions,
  MessageDescriptor
> = {
  Yes: m.incomeForm.summary.yes,
  No: m.incomeForm.summary.no,
}

export const formatAddress = (applicant?: NationalRegistryIndividual) =>
  applicant?.address
    ? `${applicant.address.streetAddress}, ${applicant.address.postalCode} ${applicant.address.locality}`
    : undefined

export const formatBankInfo = (bankInfo: {
  bankNumber?: string
  ledger?: string
  accountNumber?: string
}) =>
  bankInfo?.bankNumber && bankInfo?.ledger && bankInfo?.accountNumber
    ? bankInfo?.bankNumber +
      '-' +
      bankInfo?.ledger +
      '-' +
      bankInfo?.accountNumber
    : ''

export const formItems = (answers: FormValue, externalData: ExternalData) => {
  const answersSchema = answers as AnswersSchema
  const homeCircumstancesType = answersSchema?.homeCircumstances?.type
  const isStudent = answersSchema?.student?.isStudent

  return [
    {
      route: Routes.INRELATIONSHIP,
      label: m.inRelationship.general.sectionTitle,
      info: getMessageFamilyStatus[findFamilyStatus(answers, externalData)],
    },
    {
      route: Routes.HOMECIRCUMSTANCES,
      label: m.homeCircumstancesForm.general.sectionTitle,
      info:
        homeCircumstancesType === HomeCircumstances.OTHER
          ? answersSchema?.homeCircumstances?.custom
          : getMessageHomeCircumstances[homeCircumstancesType],
    },
    {
      route: Routes.STUDENT,
      label: m.studentForm.general.sectionTitle,
      info: getMessageApproveOptions[isStudent],
      comment:
        isStudent === ApproveOptions.Yes
          ? answersSchema?.student?.custom
          : undefined,
    },
    {
      route: Routes.EMPLOYMENT,
      label: m.employmentForm.general.sectionTitle,
      info:
        answersSchema?.employment?.type === Employment.OTHER
          ? answersSchema?.employment.custom
          : getMessageEmploymentStatus[answersSchema?.employment?.type],
    },
    {
      route: Routes.INCOME,
      label: m.incomeForm.general.sectionTitle,
      info: getMessageApproveOptionsForIncome[answersSchema?.income.type],
    },
    {
      route: Routes.PERSONALTAXCREDIT,
      label: m.summaryForm.formInfo.personalTaxCreditTitle,
      info: getMessageApproveOptions[answersSchema?.personalTaxCredit.type],
    },
    {
      route: Routes.BANKINFO,
      label: m.bankInfoForm.general.sectionTitle,
      info: formatBankInfo(answersSchema?.bankInfo),
    },
  ]
}

export const spouseFormItems = (answers: FormValue) => {
  const type = getValueViaPath(answers, 'spouseIncome.type') as ApproveOptions
  return [
    {
      route: Routes.SPOUSEINCOME,
      label: m.incomeForm.general.sectionTitle,
      info: getMessageApproveOptionsForIncome[type],
    },
  ]
}

export const getStateMessageAndColor: KeyMapping<
  ApplicationState,
  [MessageDescriptor, Colors]
> = {
  New: [m.header.new, 'blue400'],
  Approved: [m.header.approved, 'mint600'],
  Rejected: [m.header.rejected, 'red400'],
  InProgress: [m.header.inProgress, 'blue400'],
  DataNeeded: [m.header.inProgress, 'blue400'],
}

export const timelineSections = (
  created?: Date,
  modified?: Date,
  showSpouseStep?: boolean,
) => {
  const createdFormatted = formatDate(created)
  const modifiedFormatted = formatDate(modified)

  const sections = [
    {
      name: m.timeline.receivedTitle,
      text: m.timeline.receivedDescription,
      state: [ApplicationState.NEW],
      date: createdFormatted,
    },
    {
      name: m.timeline.inProgressTitle,
      text: m.timeline.inProgressDescription,
      state: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
      date: modifiedFormatted,
    },
    {
      name: m.timeline.resultsTitle,
      text: m.timeline.resultsDescription,
      state: [ApplicationState.REJECTED, ApplicationState.APPROVED],
      date: modifiedFormatted,
    },
  ]

  if (showSpouseStep) {
    sections.splice(1, 0, {
      name: m.timeline.spouseTitle,
      text: m.timeline.spouseDescription,
      state: [ApplicationState.NEW],
      date: createdFormatted,
    })
  }

  return sections
}

export const formatDate = (date?: Date) => {
  return date ? format(date, 'dd/MM/yyyy HH:mm') : null
}
