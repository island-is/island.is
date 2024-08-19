import { Application, YES, YesOrNo } from '@island.is/application/types'
import parse from 'date-fns/parse'
import {
  ApplicationDTO,
  TrWebCommonsExternalPortalsApiModelsDocumentsDocument as Attachment,
  Employer as TrWebEmployer,
  IncomeTypes,
} from '@island.is/clients/social-insurance-administration'
import {
  ApplicationType,
  Employer,
  Employment,
  RatioType,
  getApplicationAnswers as getOAPApplicationAnswers,
  getApplicationExternalData as getOAPApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import { getValueViaPath } from '@island.is/application/core'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  formatBank,
  shouldNotUpdateBankAccount,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  HouseholdSupplementHousing,
  getApplicationAnswers as getHSApplicationAnswers,
  getApplicationExternalData as getHSApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/household-supplement'
import {
  getApplicationAnswers as getASFTEApplicationAnswers,
  getApplicationExternalData as getASFTEApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/additional-support-for-the-elderly'

import {
  getApplicationAnswers as getPSApplicationAnswers,
  getApplicationExternalData as getPSApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/pension-supplement'

import {
  getApplicationAnswers as getIPApplicationAnswers,
  getApplicationExternalData as getIPApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/income-plan'

export const transformApplicationToOldAgePensionDTO = (
  application: Application,
  uploads: Attachment[],
): ApplicationDTO => {
  const {
    applicationType,
    selectedYear,
    selectedMonth,
    applicantPhonenumber,
    bank,
    bankAccountType,
    onePaymentPerYear,
    comment,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
    paymentInfo,
    employmentStatus,
    employers,
  } = getOAPApplicationAnswers(application.answers)
  const { bankInfo, userProfileEmail } = getOAPApplicationExternalData(
    application.externalData,
  )

  // If foreign residence is found then this is always true
  const residenceHistoryQuestion = getValueViaPath(
    application.answers,
    'residenceHistory.question',
    YES,
  ) as YesOrNo

  const oldAgePensionDTO: ApplicationDTO = {
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    comment: comment,
    applicationId: application.id,
    ...(!shouldNotUpdateBankAccount(bankInfo, paymentInfo) && {
      ...((bankAccountType === undefined ||
        bankAccountType === BankAccountType.ICELANDIC) && {
        domesticBankInfo: {
          bank: formatBank(bank),
        },
      }),
      ...(bankAccountType === BankAccountType.FOREIGN && {
        foreignBankInfo: {
          iban: iban.replace(/[\s]+/g, ''),
          swift: swift.replace(/[\s]+/g, ''),
          foreignBankName: bankName,
          foreignBankAddress: bankAddress,
          foreignCurrency: currency,
        },
      }),
    }),
    taxInfo: {
      personalAllowance: YES === personalAllowance,
      personalAllowanceUsage:
        YES === personalAllowance ? +personalAllowanceUsage : 0,
      taxLevel: +taxLevel,
    },
    applicantInfo: {
      email: userProfileEmail,
      phonenumber: applicantPhonenumber,
    },
    hasAbroadResidence: YES === residenceHistoryQuestion,
    hasOneTimePayment: YES === onePaymentPerYear,
    isSailorPension: applicationType === ApplicationType.SAILOR_PENSION,
    ...(applicationType == ApplicationType.HALF_OLD_AGE_PENSION && {
      employment: employmentStatus,
      ...(employmentStatus === Employment.EMPLOYEE && {
        employers: getEmployers(employers),
      }),
    }),
    uploads,
  }

  return oldAgePensionDTO
}

export const transformApplicationToHouseholdSupplementDTO = (
  application: Application,
  uploads: Attachment[],
): ApplicationDTO => {
  const {
    selectedYear,
    selectedMonth,
    applicantPhonenumber,
    bank,
    bankAccountType,
    comment,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
    paymentInfo,
    householdSupplementHousing,
    householdSupplementChildren,
  } = getHSApplicationAnswers(application.answers)
  const { bankInfo, userProfileEmail } = getHSApplicationExternalData(
    application.externalData,
  )

  const householdSupplementDTO: ApplicationDTO = {
    applicationId: application.id,
    applicantInfo: {
      email: userProfileEmail,
      phonenumber: applicantPhonenumber,
    },
    ...(!shouldNotUpdateBankAccount(bankInfo, paymentInfo) && {
      ...((bankAccountType === undefined ||
        bankAccountType === BankAccountType.ICELANDIC) && {
        domesticBankInfo: {
          bank: formatBank(bank),
        },
      }),
      ...(bankAccountType === BankAccountType.FOREIGN && {
        foreignBankInfo: {
          iban: iban.replace(/[\s]+/g, ''),
          swift: swift.replace(/[\s]+/g, ''),
          foreignBankName: bankName,
          foreignBankAddress: bankAddress,
          foreignCurrency: currency,
        },
      }),
    }),
    isRental: householdSupplementHousing === HouseholdSupplementHousing.RENTER,
    hasAStudyingAdolescenceResident: YES === householdSupplementChildren,
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    uploads,
    comment: comment,
  }

  return householdSupplementDTO
}

export const transformApplicationToAdditionalSupportForTheElderlyDTO = (
  application: Application,
  uploads: Attachment[],
): ApplicationDTO => {
  const {
    selectedYear,
    selectedMonth,
    applicantPhonenumber,
    bank,
    bankAccountType,
    comment,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
  } = getASFTEApplicationAnswers(application.answers)
  const { bankInfo, userProfileEmail } = getASFTEApplicationExternalData(
    application.externalData,
  )

  const additionalSupportForTheElderlyDTO: ApplicationDTO = {
    applicationId: application.id,
    applicantInfo: {
      email: userProfileEmail,
      phonenumber: applicantPhonenumber,
    },
    ...(!shouldNotUpdateBankAccount(bankInfo, paymentInfo) && {
      ...((bankAccountType === undefined ||
        bankAccountType === BankAccountType.ICELANDIC) && {
        domesticBankInfo: {
          bank: formatBank(bank),
        },
      }),
      ...(bankAccountType === BankAccountType.FOREIGN && {
        foreignBankInfo: {
          iban: iban.replace(/[\s]+/g, ''),
          swift: swift.replace(/[\s]+/g, ''),
          foreignBankName: bankName,
          foreignBankAddress: bankAddress,
          foreignCurrency: currency,
        },
      }),
    }),
    taxInfo: {
      personalAllowance: YES === personalAllowance,
      personalAllowanceUsage:
        YES === personalAllowance ? +personalAllowanceUsage : 0,
      taxLevel: +taxLevel,
    },
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    uploads,
    comment: comment,
  }

  return additionalSupportForTheElderlyDTO
}

export const transformApplicationToPensionSupplementDTO = (
  application: Application,
  uploads: Attachment[],
): ApplicationDTO => {
  const {
    selectedYear,
    selectedMonth,
    applicantPhonenumber,
    bank,
    bankAccountType,
    comment,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,

    applicationReason,
  } = getPSApplicationAnswers(application.answers)
  const { email } = getPSApplicationExternalData(application.externalData)

  const pensionSupplementDTO: ApplicationDTO = {
    applicationId: application.id,
    applicantInfo: {
      email: email,
      phonenumber: applicantPhonenumber,
    },
    ...((bankAccountType === undefined ||
      bankAccountType === BankAccountType.ICELANDIC) && {
      domesticBankInfo: {
        bank: formatBank(bank),
      },
    }),
    ...(bankAccountType === BankAccountType.FOREIGN && {
      foreignBankInfo: {
        iban: iban.replace(/[\s]+/g, ''),
        swift: swift.replace(/[\s]+/g, ''),
        foreignBankName: bankName,
        foreignBankAddress: bankAddress,
        foreignCurrency: currency,
      },
    }),
    reasons: applicationReason,
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
    uploads,
    comment: comment,
  }

  return pensionSupplementDTO
}

export const transformApplicationToIncomePlanDTO = (
  application: Application,
): ApplicationDTO => {
  const { income } = getIPApplicationAnswers(application.answers)
  const { categorizedIncomeTypes } = getIPApplicationExternalData(
    application.externalData,
  )

  console.log('--> income ', income)

  const incomePlanDTO: ApplicationDTO = {
    applicantInfo: {
      email: 'karenb@gmail.com',
      phonenumber: '844-6186',
    },
    period: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
    applicationId: application.id,
    incomePlan: {
      incomeYear: new Date().getFullYear(), // fá á hreint hvað á senda hér inn
      incomeTypes: getIncomeTypes(application)
      //   {
      //     incomeTypeNumer: 1,
      //     incomeTypeCode: '12',
      //     incomeTypeName: i.incomeTypes,
      //     currencyCode: i.currency,
      //     incomeCategoryNumber: 1,
      //     incomeCategoryCode: '2',
      //     incomeCategoryName: i.incomeCategories,
      //     amountJan: 0,
      //     amountFeb: 0,
      //     amountMar: 0,
      //     amountApr: 0,
      //     amountMay: 0,
      //     amountJun: 0,
      //     amountJul: 0,
      //     amountAug: 0,
      //     amountSep: 0,
      //     amountOct: 0,
      //     amountNov: 0,
      //     amountDec: 0,
      //   },
      //   {
      //     incomeTypeNumer: 1,
      //     incomeTypeCode: '12',
      //     incomeTypeName: i.incomeTypes,
      //     currencyCode: i.currency,
      //     incomeCategoryNumber: 1,
      //     incomeCategoryCode: '2',
      //     incomeCategoryName: i.incomeCategories,
      //     amountJan: 0,
      //     amountFeb: 0,
      //     amountMar: 0,
      //     amountApr: 0,
      //     amountMay: 0,
      //     amountJun: 0,
      //     amountJul: 0,
      //     amountAug: 0,
      //     amountSep: 0,
      //     amountOct: 0,
      //     amountNov: 0,
      //     amountDec: 0,
      //   },
      // ],
      //getIncomeTypes(application),
      // incomeTypes: income.map((income) => {
      //   console.log('--> income', income)
      //   const incomeType = categorizedIncomeTypes.filter(
      //     (item) => item.incomeTypeName === income.incomeTypes,
      //   )

      //   return {
      //     incomeTypeNumber: incomeType[0].incomeTypeNumber,
      //     incomeTypeCode: incomeType[0].incomeTypeCode,
      //     incomeTypeName: income.incomeTypes,
      //     currencyCode: income.currency,
      //     incomeCategoryNumber: incomeType[0].categoryNumber,
      //     incomeCategoryCode: incomeType[0].categoryCode,
      //     incomeCategoryName: incomeType[0].categoryName, //income.incomeCategories,
      //     // ...(income.income === RatioType.MONTHLY &&
      //     // income?.unevenIncomePerYear?.[0] === YES
      //     //   ? {
      //     //       amountJan: Number(income.january),
      //     //       amountFeb: Number(income.february),
      //     //       amountMar: Number(income.march),
      //     //       amountApr: Number(income.april),
      //     //       amountMay: Number(income.may),
      //     //       amountJun: Number(income.june),
      //     //       amountJul: Number(income.july),
      //     //       amountAug: Number(income.august),
      //     //       amountSep: Number(income.september),
      //     //       amountOct: Number(income.october),
      //     //       amountNov: Number(income.november),
      //     //       amountDec: Number(income.december),
      //     //     }
      //     //   : {
      //     amountJan: Math.round(Number(income.incomePerYear) / 12),
      //     amountFeb: Math.round(Number(income.incomePerYear) / 12),
      //     amountMar: Math.round(Number(income.incomePerYear) / 12),
      //     amountApr: Math.round(Number(income.incomePerYear) / 12),
      //     amountMay: Math.round(Number(income.incomePerYear) / 12),
      //     amountJun: Math.round(Number(income.incomePerYear) / 12),
      //     amountJul: Math.round(Number(income.incomePerYear) / 12),
      //     amountAug: Math.round(Number(income.incomePerYear) / 12),
      //     amountSep: Math.round(Number(income.incomePerYear) / 12),
      //     amountOct: Math.round(Number(income.incomePerYear) / 12),
      //     amountNov: Math.round(Number(income.incomePerYear) / 12),
      //     amountDec: Math.round(Number(income.incomePerYear) / 12),
      //     // }),
      //   }
      // }),
    },
  }

  return incomePlanDTO
}

export const getIncomeTypes = (application: Application): IncomeTypes[] => {
  const { income } = getIPApplicationAnswers(application.answers)

  return income.map((i) => ({
    incomeTypeNumber: 1,
    incomeTypeCode: '12',
    incomeTypeName: i.incomeTypes,
    currencyCode: i.currency,
    incomeCategoryNumber: 1,
    incomeCategoryCode: '2',
    incomeCategoryName: i.incomeCategories,
    amountJan: 0,
    amountFeb: 0,
    amountMar: 0,
    amountApr: 0,
    amountMay: 0,
    amountJun: 0,
    amountJul: 0,
    amountAug: 0,
    amountSep: 0,
    amountOct: 0,
    amountNov: 0,
    amountDec: 0,
  }))
}

export const getMonthNumber = (monthName: string): number => {
  // Parse the month name and get the month number (0-based)
  const monthNumber = parse(monthName, 'MMMM', new Date())
  return monthNumber.getMonth() + 1
}

export const getApplicationType = (application: Application): string => {
  const { applicationType } = getOAPApplicationAnswers(application.answers)

  if (applicationType === ApplicationType.HALF_OLD_AGE_PENSION) {
    return ApplicationType.HALF_OLD_AGE_PENSION
  }

  // Sailors pension and Old age pension is the same application type
  return ApplicationType.OLD_AGE_PENSION
}

export const getEmployers = (employers: Employer[]): Array<TrWebEmployer> => {
  const employersInfo: TrWebEmployer[] = []

  for (const employer of employers) {
    const employerInfo = {
      email: employer.email,
      ...(employer.phoneNumber && {
        phoneNumber: employer.phoneNumber,
      }),
      ratio:
        employer.ratioType === RatioType.MONTHLY
          ? Number(employer.ratioMonthlyAvg)
          : Number(employer.ratioYearly),
      ...(employer.ratioType === RatioType.MONTHLY && {
        ratioMonthly: {
          ...(employer.ratioMonthly?.january && {
            january: Number(employer.ratioMonthly?.january),
          }),
          ...(employer.ratioMonthly?.february && {
            february: Number(employer.ratioMonthly?.february),
          }),
          ...(employer.ratioMonthly?.march && {
            march: Number(employer.ratioMonthly?.march),
          }),
          ...(employer.ratioMonthly?.april && {
            april: Number(employer.ratioMonthly?.april),
          }),
          ...(employer.ratioMonthly?.may && {
            may: Number(employer.ratioMonthly?.may),
          }),
          ...(employer.ratioMonthly?.june && {
            june: Number(employer.ratioMonthly?.june),
          }),
          ...(employer.ratioMonthly?.july && {
            july: Number(employer.ratioMonthly?.july),
          }),
          ...(employer.ratioMonthly?.august && {
            august: Number(employer.ratioMonthly?.august),
          }),
          ...(employer.ratioMonthly?.september && {
            september: Number(employer.ratioMonthly?.september),
          }),
          ...(employer.ratioMonthly?.october && {
            october: Number(employer.ratioMonthly?.october),
          }),
          ...(employer.ratioMonthly?.november && {
            november: Number(employer.ratioMonthly?.november),
          }),
          ...(employer.ratioMonthly?.december && {
            december: Number(employer.ratioMonthly?.december),
          }),
        },
      }),
    }

    employersInfo.push(...[employerInfo])
  }

  return employersInfo
}
