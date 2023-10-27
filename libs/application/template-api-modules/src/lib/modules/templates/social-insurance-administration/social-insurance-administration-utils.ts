import { Application, YES, YesOrNo } from '@island.is/application/types'
import parse from 'date-fns/parse'
import {
  Child,
  OldAgePension,
  Uploads,
} from '@island.is/clients/social-insurance-administration'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationType,
  ConnectedApplications,
  HouseholdSupplementHousing,
  getApplicationAnswers,
  isEarlyRetirement,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'

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

  // If foreign residence is found then this is always true
  const residenceHistoryQuestion = getValueViaPath(
    application.answers,
    'residenceHistory.question',
    YES,
  ) as YesOrNo

  const oldAgePensionDTO: OldAgePension = {
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    comment: comment,
    paymentInfo: {
      bank: bank,
      spouseAllowance: YES === spouseAllowance,
      personalAllowance: YES === personalAllowance,
      spouseAllowanceUsage: YES === spouseAllowance ? +spouseAllowanceUsage : 0,
      personalAllowanceUsage:
        YES === personalAllowance ? +personalAllowanceUsage : 0,
      taxLevel: taxLevel,
    },
    applicantInfo: {
      email: applicantEmail,
      phonenumber: applicantPhonenumber,
    },
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

export const getApplicationType = (application: Application): string => {
  const { applicationType } = getApplicationAnswers(application.answers)

  if (applicationType === ApplicationType.HALF_OLD_AGE_PENSION) {
    return ApplicationType.HALF_OLD_AGE_PENSION
  }

  // Sailors pension and Old age pension is the same application type
  return ApplicationType.OLD_AGE_PENSION
}
