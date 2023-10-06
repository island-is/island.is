import { Application, YES } from '@island.is/application/types'

import { getApplicationAnswers } from '@island.is/application/templates/old-age-pension'
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
      taxLevel: 0, //taxLevel, //TODO is a number in TR schema??
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

const getMonthNumber = (monthName: string): number => {
  // Parse the month name and get the month number (0-based)
  const monthNumber = parse(monthName, 'MMMM', new Date())
  return monthNumber.getMonth() + 1
}

const initChildrens = (
  childPensionSelectedCustodyKids: any,
  childPension: any[],
): any[] => {
  //
  // Map the custody kids to the correct format
  const custodyKids = Object.entries(childPensionSelectedCustodyKids).map(
    ([key, value]) => ({
      name: '',
      nationalIdOrBirthDate: value,
      childDoesNotHaveNationalId: true,
    }),
  )

  //
  // Map both children arrays together
  return [...custodyKids, ...childPension]
}
