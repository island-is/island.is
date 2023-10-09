import { Application, YES } from '@island.is/application/types'
import {
  TaxLevelOptions,
  getApplicationAnswers,
} from '@island.is/application/templates/old-age-pension'
import { parse } from 'date-fns'
import { OldAgePension } from '@island.is/clients/social-insurance-administration'

export const transformApplicationToOldAgePensionDTO = (
  application: Application,
  uploads: any,
): OldAgePension => {
  const {
    applicationType,
    selectedYear,
    selectedMonth,
    applicantEmail,
    applicantPhonenumber,
    bank,
    residenceHistoryQuestion,
    onePaymentPerYear,
    comment,
    connectedApplications,
    householdSupplementHousing,
    householdSupplementChildren,
    employmentStatus,
    employers,
    rawEmployers,
    childPensionSelectedCustodyKids,
    childPension,
    personalAllowance,
    spouseAllowance,
    personalAllowanceUsage,
    spouseAllowanceUsage,
    taxLevel,
    earlyRetirementAttachments,
  } = getApplicationAnswers(application.answers)

  return {
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    comment: comment,
    paymentInfo: {
      bank: bank,
      taxLevel: getTaxLevel(taxLevel),
      spouseAllowance: YES === spouseAllowance,
      personalAllowance: YES === personalAllowance,
      spouseAllowanceUsage: +spouseAllowanceUsage,
      personalAllowanceUsage: +personalAllowanceUsage,
    },
    applicantInfo: {
      email: applicantEmail,
      phonenumber: applicantPhonenumber,
    },
    applicationType: applicationType.toLowerCase(),
    hasAbroadResidence: YES === residenceHistoryQuestion,
    hasOneTimePayment: YES === onePaymentPerYear,
    isSailorPension: applicationType === 'sailorPension',
    isEarlyPension:
      earlyRetirementAttachments && earlyRetirementAttachments.length > 0
        ? true
        : false,
    householdSupplement: {
      isRental: householdSupplementHousing !== 'houseOwner',
      childrenUnder18: YES === householdSupplementChildren,
    },
    children: initChildrens(childPensionSelectedCustodyKids, childPension),
    connectedApplications: connectedApplications,
    uploads,
  }
}

export const getMonthNumber = (monthName: string): number => {
  // Parse the month name and get the month number (0-based)
  const monthNumber = parse(monthName, 'MMMM', new Date())
  return monthNumber.getMonth() + 1
}

export const getTaxLevel = (taxLevel: string): number => {
  const keysAndValues = Object.entries(TaxLevelOptions)

  for (let i = 0; i < keysAndValues.length; i++) {
    const [key, enumValue] = keysAndValues[i]
    if (enumValue === taxLevel) {
      return i
    }
  }

  return -1
}

export const initChildrens = (
  childPensionSelectedCustodyKids: any,
  childPension: any[],
): any[] => {
  //
  // Map the custody kids to the correct format
  const custodyKids = Object.entries(childPensionSelectedCustodyKids).map(
    ([key, value]) => ({
      name: '',
      nationalIdOrBirthDate: value,
      childDoesNotHaveNationalId: false,
    }),
  )

  //
  // Map both children arrays together
  return [...custodyKids, ...childPension]
}
