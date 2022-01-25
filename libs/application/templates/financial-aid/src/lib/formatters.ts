import {
  Employment,
  HomeCircumstances,
  KeyMapping,
} from '@island.is/financial-aid/shared/lib'

import { MessageDescriptor, useIntl } from 'react-intl'

import * as m from './messages'
import { Applicant, ApproveOptions } from './types'

const { formatMessage } = useIntl()

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

export const formatAddress = (applicant?: Applicant) =>
  applicant
    ? `${applicant.address.streetName}, ${applicant.address.postalCode} ${applicant.address.city}`
    : undefined

export const formatHomeCircumstances = (circumstance: {
  type: HomeCircumstances
  custom?: string
}) =>
  circumstance.type === HomeCircumstances.OTHER
    ? circumstance.custom
    : formatMessage(getMessageHomeCircumstances[circumstance?.type])

export const formatEmployment = (circumstance: {
  type: Employment
  custom?: string
}) =>
  circumstance.type === Employment.OTHER
    ? circumstance.custom
    : formatMessage(getMessageEmploymentStatus[circumstance?.type])

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
