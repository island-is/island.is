import { Application, YES, YesOrNo } from '@island.is/application/types'
import parse from 'date-fns/parse'
import {
  OldAgePension,
  Attachment,
} from '@island.is/clients/social-insurance-administration'
import {
  ApplicationType,
  getApplicationAnswers,
  getApplicationExternalData,
  isEarlyRetirement,
  getBank,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import { getValueViaPath } from '@island.is/application/core'

export const transformApplicationToOldAgePensionDTO = (
  application: Application,
  uploads: Attachment[],
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
    personalAllowance,
    spouseAllowance,
    personalAllowanceUsage,
    spouseAllowanceUsage,
    taxLevel,
  } = getApplicationAnswers(application.answers)

  const { bankInfo } = getApplicationExternalData(application.externalData)
  const bankNumber = getBank(bankInfo)

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
    // domesticBankInfo: {
    //   bank: bank === bankNumber ? '' : bank, // TODO: Passa að þarf að formatta bankanúmer áður en sendi
    // },
    // foreignBankInfo: {
    //   iban: '',
    //   swift: '',
    //   foreignBankName: '',
    //   foreignBankAddress: '',
    //   foreignCurrency: '',
    // },
    taxInfo: {
      spouseAllowance: YES === spouseAllowance,
      personalAllowance: YES === personalAllowance,
      spouseAllowanceUsage: YES === spouseAllowance ? +spouseAllowanceUsage : 0,
      personalAllowanceUsage:
        YES === personalAllowance ? +personalAllowanceUsage : 0,
      taxLevel: +taxLevel,
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
    uploads,
  }

  return oldAgePensionDTO
}

export const getMonthNumber = (monthName: string): number => {
  // Parse the month name and get the month number (0-based)
  const monthNumber = parse(monthName, 'MMMM', new Date())
  return monthNumber.getMonth() + 1
}

export const getApplicationType = (application: Application): string => {
  const { applicationType } = getApplicationAnswers(application.answers)

  if (applicationType === ApplicationType.HALF_OLD_AGE_PENSION) {
    return ApplicationType.HALF_OLD_AGE_PENSION
  }

  // Sailors pension and Old age pension is the same application type
  return ApplicationType.OLD_AGE_PENSION
}
