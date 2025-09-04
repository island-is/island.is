import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { EMAIL_REGEX } from '@island.is/application/core'
import { RepeaterItem, StateLifeCycle } from '@island.is/application/types'
import { ApplicantsInfo, PropertyUnit } from '../shared'

import * as m from '../lib/messages'

export const SPECIALPROVISIONS_DESCRIPTION_MAXLENGTH = 1500
export const minChangedUnitSize = 3
export const maxChangedUnitSize = 500

export const pruneAfterDays = (Days: number): StateLifeCycle => {
  return {
    shouldBeListed: false,
    shouldBePruned: true,
    whenToPrune: Days * 24 * 3600 * 1000,
  }
}

export const validateEmail = (value: string) => {
  return EMAIL_REGEX.test(value)
}

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const formatDate = (date: string) => {
  return format(parseISO(date), 'dd.MM.yyyy', {
    locale: is,
  })
}

export const isValidMeterNumber = (value: string) => {
  const meterNumberRegex = /^[0-9]{1,20}$/
  return meterNumberRegex.test(value)
}

export const isValidMeterStatus = (value: string) => {
  const meterStatusRegex = /^[0-9]{1,10}(\.[0-9])?$/
  return meterStatusRegex.test(value)
}

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')
  if (formattedBankInfo && formattedBankInfo.length >= 6) {
    return formattedBankInfo
  }
  return bankInfo
}

export const hasDuplicateApplicants = (
  applicants: ApplicantsInfo[] = [],
): boolean => {
  const seen = new Set<string>()

  for (const applicant of applicants) {
    if (seen.has(applicant.nationalIdWithName.nationalId)) {
      return true
    }
    seen.add(applicant.nationalIdWithName.nationalId)
  }

  return false
}

export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const parseCurrency = (value: string): number | undefined => {
  const numeric = value.replace(/[^\d]/g, '')
  return numeric ? Number(numeric) : undefined
}

export const getRentalPropertySize = (units: PropertyUnit[]) =>
  units.reduce(
    (total, unit) =>
      total +
      (unit.changedSize && unit.changedSize !== 0
        ? unit.changedSize
        : unit.size || 0),
    0,
  )

export const applicantTableFields: Record<string, RepeaterItem> = {
  nationalIdWithName: {
    component: 'nationalIdWithName',
    required: true,
    searchCompanies: true,
  },
  phone: {
    component: 'phone',
    required: true,
    label: m.landlordAndTenantDetails.phoneInputLabel,
    enableCountrySelector: true,
    width: 'half',
  },
  email: {
    component: 'input',
    required: true,
    label: m.landlordAndTenantDetails.emailInputLabel,
    type: 'email',
    width: 'half',
  },
  address: {
    component: 'input',
    required: true,
    label: m.landlordAndTenantDetails.addressInputLabel,
    maxLength: 100,
  },
}

export const applicantTableConfig = {
  format: {
    phone: (value: string) => value && formatPhoneNumber(value),
    nationalId: (value: string) => value && formatNationalId(value),
  },
  header: [
    m.landlordAndTenantDetails.nameInputLabel,
    m.landlordAndTenantDetails.phoneInputLabel,
    m.landlordAndTenantDetails.nationalIdHeaderLabel,
    m.landlordAndTenantDetails.emailInputLabel,
  ],
  rows: ['name', 'phone', 'nationalId', 'email'],
}

export const toISK = (v: unknown): number => {
  if (typeof v === 'number') return v
  const digits = String(v ?? '0').replace(/\D/g, '')
  return Number(digits || 0)
}
