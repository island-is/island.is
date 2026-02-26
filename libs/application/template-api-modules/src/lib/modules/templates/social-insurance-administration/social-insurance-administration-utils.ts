import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import {
  BankAccountType,
  INCOME,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  formatBank,
  getBankIsk,
  shouldNotUpdateBankAccount,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  CategorizedIncomeTypes,
  IncomePlanRow,
} from '@island.is/application/templates/social-insurance-administration-core/types'
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
  getApplicationExternalData as getMARPApplicationExternalData,
  isFirstApplication,
  OTHER,
  shouldShowCalculatedRemunerationDate,
  shouldShowConfirmationOfIllHealth,
  shouldShowConfirmationOfPendingResolution,
  shouldShowConfirmedTreatment,
  shouldShowIsStudyingFields,
  shouldShowPreviousRehabilitationOrTreatmentFields,
  shouldShowRehabilitationPlan,
} from '@island.is/application/templates/social-insurance-administration/medical-and-rehabilitation-payments'
import {
  getApplicationAnswers as getDPApplicationAnswers,
  getApplicationExternalData as getDPApplicationExternalData,
} from '@island.is/application/templates/social-insurance-administration/disability-pension'
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
  DisabilityPensionDto,
  TrWebContractsExternalDigitalIcelandDocumentsDocument as Attachment,
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
    onePaymentPerYear,
    comment,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    paymentInfo,
    employmentStatus,
    employers,
    incomePlan,
  } = getOAPApplicationAnswers(application.answers)
  const { bankInfo, userProfileEmail, incomePlanConditions, categorizedIncomeTypes } = getOAPApplicationExternalData(
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
    ...(!shouldNotUpdateBankAccount(bankInfo, bank) && {
      ...(paymentInfo &&
        (paymentInfo.bankAccountType === undefined ||
          paymentInfo.bankAccountType === BankAccountType.ICELANDIC) &&
        paymentInfo.bank && {
          domesticBankInfo: {
            bank: formatBank(getBankIsk(bank)),
          },
        }),
      ...(paymentInfo &&
        paymentInfo.bankAccountType === BankAccountType.FOREIGN &&
        paymentInfo.iban &&
        paymentInfo.swift &&
        paymentInfo.bankName &&
        paymentInfo.bankAddress &&
        paymentInfo.currency && {
          foreignBankInfo: {
            iban: paymentInfo.iban.replace(/[\s]+/g, ''),
            swift: paymentInfo.swift.replace(/[\s]+/g, ''),
            foreignBankName: paymentInfo.bankName,
            foreignBankAddress: paymentInfo.bankAddress,
            foreignCurrency: paymentInfo.currency,
          },
        }),
    }),
    incomePlan: {
      incomeYear:
        incomePlanConditions?.incomePlanYear ?? new Date().getFullYear(),
      distributeIncomeByMonth: shouldDistributeIncomeByMonth(incomePlan),
      incomeTypes: getIncomeTypes(incomePlan, categorizedIncomeTypes),
    },
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
  const {
    userProfileEmail,
    userProfilePhoneNumber,
    incomePlanConditions,
    categorizedIncomeTypes,
  } = getIPApplicationExternalData(application.externalData)

  const { incomePlan } = getIPApplicationAnswers(application.answers)

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
      distributeIncomeByMonth: shouldDistributeIncomeByMonth(incomePlan),
      incomeTypes: getIncomeTypes(incomePlan, categorizedIncomeTypes),
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
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
    educationalInstitution,
    ectsUnits,
    isReceivingBenefitsFromAnotherCountry,
    countries,
    hasUtilizedEmployeeSickPayRights,
    employeeSickPayEndDate,
    hasUtilizedUnionSickPayRights,
    unionSickPayEndDate,
    unionInfo,
    comment,
    questionnaire,
    currentEmploymentStatuses,
    currentEmploymentStatusExplanation,
    lastProfession,
    lastProfessionDescription,
    lastActivityOfProfession,
    lastActivityOfProfessionDescription,
    lastProfessionYear,
    certificateForSicknessAndRehabilitationReferenceId,
    isAlmaCertificate,
    rehabilitationPlanReferenceId,
    confirmedTreatmentReferenceId,
    confirmationOfPendingResolutionReferenceId,
    confirmationOfIllHealthReferenceId,
    educationalLevel,
    hadAssistance,
    mainProblem,
    hasPreviouslyReceivedRehabilitationOrTreatment,
    previousRehabilitationOrTreatment,
    previousRehabilitationSuccessful,
    previousRehabilitationSuccessfulFurtherExplanations,
    incomePlan,
  } = getMARPApplicationAnswers(application.answers)

  const { bankInfo, incomePlanConditions, categorizedIncomeTypes } =
    getMARPApplicationExternalData(application.externalData)

  const marpDTO: MedicalAndRehabilitationPaymentsDTO = {
    applicantInfo: {
      email: applicantEmail,
      phonenumber: applicantPhonenumber,
    },
    comment,
    applicationId: application.id,
    ...(!shouldNotUpdateBankAccount(bankInfo, paymentInfo) && {
      domesticBankInfo: {
        bank: formatBank(getBankIsk(paymentInfo)),
      },
    }),
    taxInfo: {
      personalAllowance: personalAllowance === YES,
      personalAllowanceUsage:
        personalAllowance === YES ? +personalAllowanceUsage : 0,
      taxLevel: +taxLevel,
    },
    occupation: {
      ...(isFirstApplication(application.externalData) && {
        isSelfEmployed: isSelfEmployed === YES,
        ...(shouldShowCalculatedRemunerationDate(application.answers) && {
          calculatedRemunerationDate,
        }),
        receivesForeignPayments: isReceivingBenefitsFromAnotherCountry === YES,
        ...(isReceivingBenefitsFromAnotherCountry === YES && {
          foreignPayments: countries.map(({ country, nationalId }) => {
            return {
              countryName: country.split('::')[1],
              countryCode: country.split('::')[0],
              foreignNationalId: nationalId,
            }
          }),
        }),
      }),
      isStudying: isStudying === YES,
      isPartTimeEmployed: isPartTimeEmployed === YES,
      ...(shouldShowIsStudyingFields(application.answers) && {
        educationalInstitution,
        currentSemesterEcts: ectsUnits,
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
          unionNationalId: unionInfo.split('::')[0],
          unionName: unionInfo.split('::')[1],
          unionSickPayEndDate,
        }),
      },
    }),
    baseCertificateReference:
      certificateForSicknessAndRehabilitationReferenceId ?? '',
    isAlmaCertificate: isAlmaCertificate === 'true',
    ...(shouldShowRehabilitationPlan(application.externalData) && {
      rehabilitationPlanReference: rehabilitationPlanReferenceId,
    }),
    preQuestionnaire: {
      highestEducation: educationalLevel || '',
      employmentStatuses: currentEmploymentStatuses.map((status) => ({
        employmentStatus: status,
        explanation:
          status === OTHER ? currentEmploymentStatusExplanation ?? '' : null,
      })),
      ...(lastProfession && { lastProfession }),
      ...(lastProfession === OTHER && {
        lastProfessionDescription,
      }),
      ...(lastActivityOfProfession && {
        lastActivityOfProfession,
      }),
      ...(lastActivityOfProfession === OTHER && {
        lastActivityOfProfessionDescription,
      }),
      ...(lastProfessionYear && { lastProfessionYear: +lastProfessionYear }),
      disabilityReason: mainProblem || '',
      hasParticipatedInRehabilitationBefore:
        hasPreviouslyReceivedRehabilitationOrTreatment === YES,
      ...(shouldShowPreviousRehabilitationOrTreatmentFields(
        application.answers,
      ) && {
        rehabilitationDetails: previousRehabilitationOrTreatment,
        previousRehabilitationSuccessful:
          previousRehabilitationSuccessful === YES,
        ...((previousRehabilitationSuccessful === YES ||
          previousRehabilitationSuccessful === NO) && {
          additionalRehabilitationInformation:
            previousRehabilitationSuccessfulFurtherExplanations,
        }),
      }),
    },
    ...(shouldShowConfirmedTreatment(application.externalData) && {
      confirmedTreatmentReference: confirmedTreatmentReferenceId,
    }),
    ...(shouldShowConfirmationOfPendingResolution(application.externalData) && {
      confirmationOfPendingResolutionReference:
        confirmationOfPendingResolutionReferenceId,
    }),
    ...(shouldShowConfirmationOfIllHealth(application.externalData) && {
      confirmationOfIllHealthReference: confirmationOfIllHealthReferenceId,
    }),
    selfAssessment: {
      hadAssistance: hadAssistance === YES,
      answers: questionnaire,
    },
    incomePlan: {
      incomeYear:
        incomePlanConditions?.incomePlanYear ?? new Date().getFullYear(),
      distributeIncomeByMonth: shouldDistributeIncomeByMonth(incomePlan),
      incomeTypes: getIncomeTypes(incomePlan, categorizedIncomeTypes),
    },
  }

  return marpDTO
}

export const transformApplicationToDisabilityPensionDTO = (
  application: Application,
): DisabilityPensionDto => {
  const {
    applicantPhonenumber,
    applicantEmail,
    paymentInfo,
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
    incomePlan,
    isReceivingBenefitsFromAnotherCountry,
    countries: abroadPaymentsList,
    hasAppliedForDisabilityBefore,
    disabilityRenumerationDateYear,
    disabilityRenumerationDateMonth,
    hasLivedAbroad,
    livedAbroadList,
    inPaidWork,
    willContinueWorking,
    maritalStatus,
    residence,
    residenceExtraComment,
    children,
    icelandicCapability,
    language,
    languageOther,
    employmentStatus,
    employmentStatusOther,
    previousEmployment,
    employmentCapability,
    employmentImportance,
    hasHadRehabilitationOrTherapy,
    rehabilitationOrTherapyResults,
    rehabilitationOrTherapyDescription,
    biggestIssue,
    educationLevel,
    hadAssistanceForSelfEvaluation,
    questionnaire,
    extraInfo,
  } = getDPApplicationAnswers(application.answers)

  const { bankInfo, countries, incomePlanConditions, categorizedIncomeTypes } =
    getDPApplicationExternalData(application.externalData)

  const dpDto: DisabilityPensionDto = {
    applicantInfo: {
      email: applicantEmail,
      phonenumber: applicantPhonenumber,
    },
    applicationId: application.id,
    ...(!shouldNotUpdateBankAccount(bankInfo, paymentInfo) && {
      ...(paymentInfo &&
        (paymentInfo.bankAccountType === undefined ||
          paymentInfo.bankAccountType === BankAccountType.ICELANDIC) &&
        paymentInfo.bank && {
          domesticBankInfo: {
            bank: formatBank(paymentInfo.bank),
          },
        }),
      ...(paymentInfo &&
        paymentInfo.bankAccountType === BankAccountType.FOREIGN &&
        paymentInfo.iban &&
        paymentInfo.swift &&
        paymentInfo.bankName &&
        paymentInfo.bankAddress &&
        paymentInfo.currency && {
          foreignBankInfo: {
            iban: paymentInfo.iban.replace(/[\s]+/g, ''),
            swift: paymentInfo.swift.replace(/[\s]+/g, ''),
            foreignBankName: paymentInfo.bankName,
            foreignBankAddress: paymentInfo.bankAddress,
            foreignCurrency: paymentInfo.currency,
          },
        }),
    }),
    incomePlan: {
      incomeYear:
        incomePlanConditions?.incomePlanYear ?? new Date().getFullYear(),
      distributeIncomeByMonth: shouldDistributeIncomeByMonth(incomePlan ?? []),
      incomeTypes: getIncomeTypes(
        incomePlan ?? [],
        categorizedIncomeTypes ?? [],
      ),
    },
    taxInfo: {
      personalAllowance: personalAllowance === YES,
      personalAllowanceUsage:
        personalAllowance === YES
          ? Number.parseInt(personalAllowanceUsage)
          : -1,
      taxLevel: +taxLevel,
    },
    hasAppliedForDisabilityAtPensionFund: hasAppliedForDisabilityBefore === YES,
    isInPaidEmployment: inPaidWork === YES,
    plansToContinueParticipation:
      inPaidWork === YES ? willContinueWorking === YES : undefined,
    housingTypeId: residence ? Number.parseInt(residence) : -1,
    housingTypeAdditionalDescription: residenceExtraComment,
    numberOfChildrenInHome: children ?? '',
    languageProficiency: icelandicCapability
      ? Number.parseInt(icelandicCapability)
      : -1,
    applicantNativeLanguage: language ?? '',
    applicantNativeLanguageOther: languageOther,
    hasBeenInPaidEmployment: previousEmployment?.hasEmployment
      ? previousEmployment.hasEmployment === YES
      : false,
    lastProfession: previousEmployment?.job,
    lastProfessionYear: previousEmployment?.when
      ? Number.parseInt(previousEmployment.when)
      : undefined,
    lastProfessionDescription: previousEmployment?.jobOther,
    lastActivityOfProfession: previousEmployment?.field,
    lastActivityOfProfessionDescription: previousEmployment?.fieldOther,
    educationalLevel: educationLevel ?? '',
    workCapacityAssessment: employmentCapability
      ? Number.parseInt(employmentCapability)
      : -1,
    importanceOfEmployment: employmentImportance
      ? Number.parseInt(employmentImportance)
      : -1,
    hasBeenInRehabilitationOrTreatment: hasHadRehabilitationOrTherapy === YES,
    rehabilitationOrTreatment: rehabilitationOrTherapyDescription,
    rehabilitationOrTreatmentOutcome: rehabilitationOrTherapyResults,
    workIncapacityIssue: biggestIssue,
    foreignPaymentDetails: {
      receivesForeignPayments: isReceivingBenefitsFromAnotherCountry === YES,
      foreignPaymentDetails: (abroadPaymentsList ?? []).map(
        ({ country, abroadNationalId }) => {
          return {
            countryName:
              countries?.find((item) => item.value === country)?.label ?? '',
            countryCode: country,
            foreignNationalId: abroadNationalId ?? '',
          }
        },
      ),
    },
    foreignResidencies:
      hasLivedAbroad === YES
        ? livedAbroadList?.map((abroadStay) => {
            const countryName = countries?.find(
              (item) => item.value === abroadStay.country,
            )?.label
            return {
              countryName: countryName ?? '',
              countryCode: abroadStay.country,
              foreignNationalId: abroadStay.abroadNationalId ?? '',
              dateFrom: abroadStay.periodStart,
              dateTo: abroadStay.periodEnd,
            }
          }) ?? []
        : [],
    maritalStatusTypeId: maritalStatus ? Number.parseInt(maritalStatus) : -1,
    selfAssessment: {
      hadAssistance: hadAssistanceForSelfEvaluation === YES,
      answers: (questionnaire ?? []).map((question) => ({
        questionId: question.id,
        answer: question.answer.toString(),
      })),
    },
    employmentStatuses:
      employmentStatus?.map((status) => ({
        employmentStatus: status,
        explanation:
          status === 'ANNAD' && employmentStatusOther
            ? employmentStatusOther
            : '',
      })) ?? [],
    retroactivePayments: {
      year: disabilityRenumerationDateYear
        ? Number.parseInt(disabilityRenumerationDateYear)
        : -1,
      month: disabilityRenumerationDateMonth
        ? Number.parseInt(disabilityRenumerationDateMonth) + 1
        : -1,
    },
    comment: extraInfo,
  }
  return dpDto
}

export const getIncomeTypes = (
  incomePlan: IncomePlanRow[],
  categorizedIncomeTypes: CategorizedIncomeTypes[],
): IncomeTypes[] => {
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

export const shouldDistributeIncomeByMonth = (incomePlan: IncomePlanRow[]) => {
  // Let TR know if there is any case where income is uneven during the year
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
