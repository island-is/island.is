import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import {
  BankAccountType,
  INCOME,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  formatBank,
  shouldNotUpdateBankAccount,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  getApplicationAnswers as getASFTEApplicationAnswers,
  getApplicationExternalData as getASFTEApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/additional-support-for-the-elderly'
import {
  getApplicationAnswers as getDBApplicationAnswers,
  getApplicationExternalData as getDBApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/death-benefits'
import {
  getApplicationAnswers as getHSApplicationAnswers,
  getApplicationExternalData as getHSApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/household-supplement'
import {
  getApplicationAnswers as getIPApplicationAnswers,
  getApplicationExternalData as getIPApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/income-plan'
import {
  getApplicationAnswers as getMARPApplicationAnswers,
  isEHApplication,
  isFirstApplication,
  SelfAssessmentCurrentEmploymentStatus,
} from '@island.is/application/templates/social-insurance-administration/medical-and-rehabilitation-payments'
import {
  ApplicationType,
  Employer,
  Employment,
  getApplicationAnswers as getOAPApplicationAnswers,
  getApplicationExternalData as getOAPApplicationExternalData,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import {
  getApplicationAnswers as getPSApplicationAnswers,
  getApplicationExternalData as getPSApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/pension-supplement'
import { Application } from '@island.is/application/types'
import {
  ApplicationDTO,
  TrWebCommonsExternalPortalsApiModelsDocumentsDocument as Attachment,
  IncomeTypes,
  MedicalAndRehabilitationPaymentsDTO,
  Employer as TrWebEmployer,
} from '@island.is/clients/social-insurance-administration'
import parse from 'date-fns/parse'

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
    comment,
    paymentInfo,
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
      domesticBankInfo: {
        bank: formatBank(bank),
      },
    }),
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
): ApplicationDTO => {
  const {
    selectedYear,
    selectedMonth,
    applicantPhonenumber,
    bank,
    comment,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    higherPayments,
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
      domesticBankInfo: {
        bank: formatBank(bank),
      },
    }),
    taxInfo: {
      personalAllowance: YES === personalAllowance,
      personalAllowanceUsage:
        YES === personalAllowance ? +personalAllowanceUsage : 0,
      taxLevel: +taxLevel,
    },
    livesAloneUserReply: YES === higherPayments,
    livesAloneNationalRegistryData: livesAlone(application),
    period: {
      year: +selectedYear,
      month: getMonthNumber(selectedMonth),
    },
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

export const transformApplicationToDeathBenefitsDTO = (
  application: Application,
  uploads: Attachment[],
): ApplicationDTO => {
  const {
    applicantPhonenumber,
    comment,
    bankAccountType,
    bank,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    spouseAllowance,
    spouseAllowanceUsage,
    taxLevel,
    deceasedSpouseNationalId,
  } = getDBApplicationAnswers(application.answers)
  const { bankInfo, userProfileEmail, children } = getDBApplicationExternalData(
    application.externalData,
  )

  const deathBenefitsDTO: ApplicationDTO = {
    deceasedNationalId: deceasedSpouseNationalId,
    childrenNationalIds: children.map(({ nationalId }) => nationalId),
    spouseTaxCardUsage: {
      usecard: spouseAllowance === YES,
      ratio: YES === spouseAllowance ? +spouseAllowanceUsage : 0,
    },
    applicantInfo: {
      email: userProfileEmail,
      phonenumber: applicantPhonenumber,
    },
    period: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
    comment,
    applicationId: application.id,
    uploads,
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
  }
  return deathBenefitsDTO
}

export const transformApplicationToIncomePlanDTO = (
  application: Application,
): ApplicationDTO => {
  const { userProfileEmail, userProfilePhoneNumber, incomePlanConditions } =
    getIPApplicationExternalData(application.externalData)

  const incomePlanDTO: ApplicationDTO = {
    applicantInfo: {
      email: userProfileEmail,
      phonenumber: userProfilePhoneNumber,
    },
    period: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
    applicationId: application.id,
    incomePlan: {
      incomeYear: incomePlanConditions.incomePlanYear,
      distributeIncomeByMonth: shouldDistributeIncomeByMonth(application),
      incomeTypes: getIncomeTypes(application),
    },
  }

  return incomePlanDTO
}

export const transformApplicationToMedicalAndRehabilitationPaymentsDTO = (
  application: Application,
): MedicalAndRehabilitationPaymentsDTO => {
  const {
    applicantPhonenumber,
    applicantEmail,
    // bank,
    //paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
    educationalInstitution,
    // ectsUnits,
    isReceivingBenefitsFromAnotherCountry,
    // countries,
    hasUtilizedEmployeeSickPayRights,
    employeeSickPayEndDate,
    hasUtilizedUnionSickPayRights,
    unionSickPayEndDate,
    unionNationalId,
    comment,
    questionnaire,
    currentEmploymentStatus,
    currentEmploymentStatusAdditional,
    lastEmploymentTitle,
    lastEmploymentYear,
    certificateForSicknessAndRehabilitationReferenceId,
    educationalLevel,
    hadAssistance,
  } = getMARPApplicationAnswers(application.answers)

  //  const { bankInfo } = getMARPApplicationExternalData(application.externalData)

  const marpDTO: MedicalAndRehabilitationPaymentsDTO = {
    applicantInfo: {
      email: applicantEmail,
      phonenumber: applicantPhonenumber,
    },
    period: {
      year: new Date().getFullYear(), //TODO: remove when backend is ready
      month: new Date().getMonth(), //TODO: remove when backend is ready
    },
    comment,
    applicationId: application.id,
    // ...(!shouldNotUpdateBankAccount(bankInfo, paymentInfo) && { // LAGA shouldNotUpdateBankAccount(bankInfo
    //   domesticBankInfo: {
    //     bank: getBankIsk(bank),
    //   },
    // }),
    taxInfo: {
      personalAllowance: personalAllowance === YES,
      personalAllowanceUsage:
        personalAllowance === YES ? +personalAllowanceUsage : 0,
      taxLevel: +taxLevel,
    },
    occupation: {
      ...(isFirstApplication(application.externalData) && {
        isSelfEmployed: isSelfEmployed === YES,
      }),
      isStudying: isStudying === YES,
      isPartTimeEmployed: isPartTimeEmployed === YES,
      ...(isFirstApplication(application.externalData) && {
        receivingPaymentsFromOtherCountry:
          isReceivingBenefitsFromAnotherCountry === YES,
      }),
      ...(isSelfEmployed === YES && {
        calculatedRemunerationDate,
      }),
      ...(isStudying === YES && {
        educationalInstitution,
      }),
    },
    ...(isFirstApplication(application.externalData) && {
      employeeSickPay: {
        hasUtilizedEmployeeSickPayRights: getYesNoNotApplicableValue(
          hasUtilizedEmployeeSickPayRights,
        ),
        ...((hasUtilizedEmployeeSickPayRights === YES ||
          hasUtilizedEmployeeSickPayRights === NO) && {
          employeeSickPayEndDate,
        }),
      },
      unionSickPay: {
        hasUtilizedUnionSickPayRights: getYesNoNotApplicableValue(
          hasUtilizedUnionSickPayRights,
        ),
        ...((hasUtilizedUnionSickPayRights === YES ||
          hasUtilizedUnionSickPayRights === NO) && {
          unionNationalId,
          unionSickPayEndDate,
        }),
      },
    }),
    baseCertificateReference:
      certificateForSicknessAndRehabilitationReferenceId ?? '',
    ...(isEHApplication(application.externalData) && {
      rehabilitationPlanReference: 'test', //TODO:
    }),
    selfAssessment: {
      hadAssistance: hadAssistance === YES,
      educationalLevel: educationalLevel || '',
      currentEmploymentStatus,
      ...(currentEmploymentStatus?.includes(
        SelfAssessmentCurrentEmploymentStatus.OTHER,
      ) && { currentEmploymentStatusAdditional }),
      ...(lastEmploymentTitle && { lastEmploymentTitle }),
      ...(lastEmploymentYear && { lastEmploymentYear: +lastEmploymentYear }),
      answers: questionnaire.map((question) => ({
        questionId: question.questionId,
        answer: question.answer,
      })),
    },
  }

  return marpDTO
}

export const getIncomeTypes = (application: Application): IncomeTypes[] => {
  const { incomePlan } = getIPApplicationAnswers(application.answers)
  const { categorizedIncomeTypes } = getIPApplicationExternalData(
    application.externalData,
  )

  return incomePlan.map((i) => ({
    incomeTypeNumber:
      categorizedIncomeTypes.find((c) => c.incomeTypeName === i.incomeType)
        ?.incomeTypeNumber ?? 0,
    incomeTypeCode:
      categorizedIncomeTypes.find((c) => c.incomeTypeName === i.incomeType)
        ?.incomeTypeCode ?? '',
    incomeTypeName: i.incomeType,
    currencyCode: i.currency,
    incomeCategoryNumber:
      categorizedIncomeTypes.find((c) => c.incomeTypeName === i.incomeType)
        ?.categoryNumber ?? 0,
    incomeCategoryCode:
      categorizedIncomeTypes.find((c) => c.incomeTypeName === i.incomeType)
        ?.categoryCode ?? '',
    incomeCategoryName: i.incomeCategory,
    ...(i.income === RatioType.MONTHLY &&
    i?.incomeCategory === INCOME &&
    i?.unevenIncomePerYear?.[0] === YES
      ? {
          amountJan: Number(i.january),
          amountFeb: Number(i.february),
          amountMar: Number(i.march),
          amountApr: Number(i.april),
          amountMay: Number(i.may),
          amountJun: Number(i.june),
          amountJul: Number(i.july),
          amountAug: Number(i.august),
          amountSep: Number(i.september),
          amountOct: Number(i.october),
          amountNov: Number(i.november),
          amountDec: Number(i.december),
        }
      : {
          amountJan: Number(i.incomePerYear) / 12,
          amountFeb: Number(i.incomePerYear) / 12,
          amountMar: Number(i.incomePerYear) / 12,
          amountApr: Number(i.incomePerYear) / 12,
          amountMay: Number(i.incomePerYear) / 12,
          amountJun: Number(i.incomePerYear) / 12,
          amountJul: Number(i.incomePerYear) / 12,
          amountAug: Number(i.incomePerYear) / 12,
          amountSep: Number(i.incomePerYear) / 12,
          amountOct: Number(i.incomePerYear) / 12,
          amountNov: Number(i.incomePerYear) / 12,
          amountDec: Number(i.incomePerYear) / 12,
        }),
  }))
}

export const shouldDistributeIncomeByMonth = (application: Application) => {
  // Let TR know if there is any case where income is uneven during the year
  const { incomePlan } = getIPApplicationAnswers(application.answers)

  const hasUnevenIncome = incomePlan.some(
    (i) => i?.unevenIncomePerYear?.[0] === YES && i?.incomeCategory === INCOME,
  )
  return hasUnevenIncome
}

export const livesAlone = (application: Application) => {
  const { cohabitants } = getASFTEApplicationExternalData(
    application.externalData,
  )
  return cohabitants.length === 0
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

export const getYesNoNotApplicableValue = (value?: string): number | null => {
  switch (value) {
    case YES:
      return 1
    case NO:
      return 0
    default:
      return null
  }
}
