import { Application, YES } from '@island.is/application/types'

import { getApplicationAnswers } from '@island.is/application/templates/old-age-pension'
import { parse } from 'date-fns'

export const transformApplicationToOldAgePensionDTO = (
  application: Application,
  uploads: any,
): any => {
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
    earlyRetirementFiles,
  } = getApplicationAnswers(application.answers)

  const custodyKids = Object.entries(childPensionSelectedCustodyKids).map(
    ([key, value]) => ({
      name: '',
      nationalIdOrBirthDate: value,
      childDoesNotHaveNationalId: true,
    }),
  )

  const childrens = [...custodyKids, ...childPension]

  return {
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    comment: comment,
    paymentInfo: {
      bank: bank,
      taxLevel: taxLevel,
      spouseAllowance: YES === spouseAllowance,
      personalAllowance: YES === personalAllowance,
      spouseAllowanceUsage: spouseAllowanceUsage,
      personalAllowanceUsage: personalAllowanceUsage,
    },
    applicantInfo: {
      email: applicantEmail,
      phonenumber: applicantPhonenumber,
    },
    applicationType: applicationType,
    hasAbroadResidence: YES === residenceHistoryQuestion,
    hasOneTimePayment: YES === onePaymentPerYear,
    isSailorPension: applicationType === 'sailorPension',
    isEarlyPension: earlyRetirementFiles && earlyRetirementFiles.length > 0,
    householdSupplement: {
      isRental: householdSupplementHousing !== 'houseOwner',
      childrenUnder18: YES === householdSupplementChildren,
    },
    children: childrens,
    connectedApplications: connectedApplications,
    uploads,
  }
}

export const getMonthNumber = (monthName: string): number => {
  // Parse the month name and get the month number (0-based)
  const monthNumber = parse(monthName, 'MMMM', new Date())
  return monthNumber.getMonth() + 1
}
