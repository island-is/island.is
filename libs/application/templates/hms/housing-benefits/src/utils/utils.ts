import { getValueViaPath, YES } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { getLandlordOptionsForSelectedContract } from './rentalAgreementUtils'

export const isHouseholdMemberUnder18 = (
  _application: Application,
  activeField?: Record<string, unknown>,
): boolean => {
  const nationalId =
    (activeField?.nationalIdWithName as { nationalId?: string })?.nationalId ??
    (activeField?.nationalId as string)
  if (!nationalId || typeof nationalId !== 'string') return false
  try {
    return kennitala.isValid(nationalId) && kennitala.info(nationalId).age < 18
  } catch {
    return false
  }
}

export const isFileUploaded = (answers: FormValue): boolean => {
  const rows = getValueViaPath<
    Array<{ file?: Array<{ key: string; name: string }> }>
  >(answers, 'householdMembersTableRepeater')
  return (
    Array.isArray(rows) &&
    rows.some((row) => Array.isArray(row.file) && row.file.length > 0)
  )
}

export const isLandlordSelected = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'paymentRadio') === 'landlord'

export const shouldShowLandlordSelection = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  isLandlordSelected(answers) &&
  getLandlordOptionsForSelectedContract({
    answers,
    externalData,
  } as Application).length > 1

export const isMeSelected = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'paymentRadio') === 'me'

export const isExemptionRequested = (answers: FormValue) => {
  const exemptionCheckbox = getValueViaPath<string[]>(
    answers,
    'exemptionCheckbox',
  )
  return Array.isArray(exemptionCheckbox) && exemptionCheckbox.includes(YES)
}

export const isExemptionReason = (answers: FormValue, reason: string) =>
  isExemptionRequested(answers) &&
  getValueViaPath<string>(answers, 'exemptionReason') === reason
