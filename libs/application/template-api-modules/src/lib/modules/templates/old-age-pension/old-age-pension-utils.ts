import { Application, YES } from '@island.is/application/types'
import {
  ApplicationType,
  ConnectedApplications,
  HouseholdSupplementHousing,
  getApplicationAnswers,
  isEarlyRetirement,
} from '@island.is/application/templates/old-age-pension'
import parse from 'date-fns/parse'
import {
  Child,
  OldAgePension,
  Uploads,
} from '@island.is/clients/social-insurance-administration'

export const transformApplicationToOldAgePensionDTO = (
  application: Application,
  uploads: Uploads,
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
    childPensionSelectedCustodyKids,
    childPension,
    childPensionAddChild,
    personalAllowance,
    spouseAllowance,
    personalAllowanceUsage,
    spouseAllowanceUsage,
    taxLevel,
  } = getApplicationAnswers(application.answers)

  const oldAgePensionDTO: OldAgePension = {
    applicationId: application.id,
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    comment: comment,
    paymentInfo: {
      bank: bank,
      taxLevel: +taxLevel,
      spouseAllowance: YES === spouseAllowance,
      personalAllowance: YES === personalAllowance,
      spouseAllowanceUsage: +spouseAllowanceUsage || 0,
      personalAllowanceUsage: +personalAllowanceUsage || 0,
    },
    applicantInfo: {
      email: applicantEmail,
      phonenumber: applicantPhonenumber,
    },
    applicationType: getApplicationType(applicationType),
    hasAbroadResidence: YES === residenceHistoryQuestion,
    hasOneTimePayment: YES === onePaymentPerYear,
    isSailorPension: applicationType === ApplicationType.SAILOR_PENSION,
    isEarlyPension: isEarlyRetirement(
      application.answers,
      application.externalData,
    ),
    connectedApplications: connectedApplications,
    uploads,
  }

  if (
    connectedApplications?.includes(ConnectedApplications.HOUSEHOLDSUPPLEMENT)
  ) {
    oldAgePensionDTO.householdSupplement = {
      isRental: householdSupplementHousing == HouseholdSupplementHousing.RENTER,
      childrenUnder18: YES === householdSupplementChildren,
    }
  }

  if (connectedApplications?.includes(ConnectedApplications.CHILDPENSION)) {
    oldAgePensionDTO.children = initChildrens(
      childPensionSelectedCustodyKids,
      childPension,
      childPensionAddChild === YES,
    )
  }

  return oldAgePensionDTO
}

export const getMonthNumber = (monthName: string): number => {
  // Parse the month name and get the month number (0-based)
  const monthNumber = parse(monthName, 'MMMM', new Date())
  return monthNumber.getMonth() + 1
}

export const initChildrens = (
  childPensionSelectedCustodyKids: string[],
  childPension: Child[],
  childPensionAddChild: boolean,
): Child[] => {
  // Map the custody kids to the correct format
  const custodyKids = childPensionSelectedCustodyKids.map((value) => ({
    name: '',
    nationalIdOrBirthDate: value,
    childDoesNotHaveNationalId: false,
  }))

  // If applicant is not adding children then not send childPension data to TR
  if (childPensionAddChild) {
    // Map both children arrays together
    return [...custodyKids, ...childPension]
  }

  return custodyKids
}

export const getApplicationType = (applicationType: string): number => {
  if (applicationType === ApplicationType.HALF_OLD_AGE_PENSION) {
    return +ApplicationType.HALF_OLD_AGE_PENSION
  }

  // Sailors pension and Old age pension is the same application type
  return +ApplicationType.OLD_AGE_PENSION
}
