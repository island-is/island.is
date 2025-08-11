import { ApolloClient } from '@apollo/client'
import { NO, YES } from '@island.is/application/core'
import { siaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/graphql/queries'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  formatBankAccount,
  getTaxLevelOption,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { SiaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/types/schema'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
  TableData,
} from '@island.is/application/types'
import { formatCurrencyWithoutSuffix } from '@island.is/application/ui-components'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import { medicalAndRehabilitationPaymentsFormMessage } from '../lib/messages'
import { isFirstApplication } from './conditionUtils'
import {
  NOT_APPLICABLE,
  SelfAssessmentCurrentEmploymentStatus,
} from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getSelfAssessmentCurrentEmploymentStatusOptions,
  getSickPayEndDateLabel,
  getYesNoNotApplicableTranslation,
} from './medicalAndRehabilitationPaymentsUtils'

export const applicantItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { applicantPhonenumber } = getApplicationAnswers(answers)
  const {
    applicantName,
    applicantNationalId,
    applicantAddress,
    apartmentNumber,
    applicantLocation,
    applicantAddressAndApartment,
    userProfileEmail,
    spouseName,
    spouseNationalId,
  } = getApplicationExternalData(externalData)

  const applicantItems: Array<KeyValueItem> =
    applicantName !== ''
      ? [
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.confirm.name,
            valueText: applicantName,
          },
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.confirm.nationalId,
            valueText: formatKennitala(applicantNationalId ?? ''),
          },
        ]
      : []

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: socialInsuranceAdministrationMessage.confirm.address,
      valueText: apartmentNumber
        ? applicantAddressAndApartment
        : applicantAddress,
    },
    {
      width: 'half',
      keyText: socialInsuranceAdministrationMessage.confirm.municipality,
      valueText: applicantLocation,
    },
    {
      width: 'half',
      keyText: socialInsuranceAdministrationMessage.info.applicantEmail,
      valueText: userProfileEmail,
    },
    {
      width: 'half',
      keyText: socialInsuranceAdministrationMessage.info.applicantPhonenumber,
      valueText: formatNumber(applicantPhonenumber, 'International'),
    },
  ]

  const spouseItems: Array<KeyValueItem> = spouseName
    ? [
        {
          width: 'half',
          keyText:
            socialInsuranceAdministrationMessage.info.applicantSpouseName,
          valueText: spouseName,
        },
        {
          width: 'half',
          keyText: socialInsuranceAdministrationMessage.confirm.nationalId,
          valueText: formatKennitala(spouseNationalId ?? ''),
        },
      ]
    : []

  return [...applicantItems, ...baseItems, ...spouseItems]
}

export const paymentItems = (answers: FormValue): Array<KeyValueItem> => {
  const { paymentInfo, personalAllowance, personalAllowanceUsage, taxLevel } =
    getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: socialInsuranceAdministrationMessage.payment.bank,
      valueText: formatBankAccount(paymentInfo),
    },
    {
      width: 'half',
      keyText: socialInsuranceAdministrationMessage.confirm.personalAllowance,
      valueText:
        personalAllowance === YES
          ? socialInsuranceAdministrationMessage.shared.yes
          : socialInsuranceAdministrationMessage.shared.no,
    },
  ]

  const personalAllowanceUsageItem: Array<KeyValueItem> =
    personalAllowance === YES
      ? [
          {
            width: 'half',
            keyText: socialInsuranceAdministrationMessage.confirm.ratio,
            valueText: `${personalAllowanceUsage}%`,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: socialInsuranceAdministrationMessage.payment.taxLevel,
      valueText: getTaxLevelOption(taxLevel),
    },
  ]

  return [...baseItems, ...personalAllowanceUsageItem, ...baseItems2]
}

export const incomePlanTable = (
  answers: FormValue,
  _externalData: ExternalData,
): TableData => {
  const { incomePlan } = getApplicationAnswers(answers)

  return {
    header: [
      socialInsuranceAdministrationMessage.incomePlan.incomeType,
      socialInsuranceAdministrationMessage.incomePlan.incomePerYear,
      socialInsuranceAdministrationMessage.incomePlan.currency,
    ],
    rows: incomePlan.map((e) => [
      e.incomeType,
      formatCurrencyWithoutSuffix(e.incomePerYear),
      e.currency,
    ]),
  }
}

export const benefitsFromAnotherCountryItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const { isReceivingBenefitsFromAnotherCountry } =
    getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .benefitsFromAnotherCountryTitle,
      valueText:
        isReceivingBenefitsFromAnotherCountry === YES
          ? socialInsuranceAdministrationMessage.shared.yes
          : socialInsuranceAdministrationMessage.shared.no,
    },
  ]
}

export const benefitsFromAnotherCountryTable = (
  answers: FormValue,
  _externalData: ExternalData,
): TableData => {
  const { isReceivingBenefitsFromAnotherCountry, countries } =
    getApplicationAnswers(answers)

  if (isReceivingBenefitsFromAnotherCountry === YES) {
    return {
      header: [
        medicalAndRehabilitationPaymentsFormMessage.generalInformation.country,
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .countryIdNumber,
      ],
      rows: countries.map((e) => [e.country?.split('::')[1], e.nationalId]),
    }
  }

  return { header: [], rows: [] }
}

export const questionsItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
    educationalInstitution,
    ectsUnits,
  } = getApplicationAnswers(answers)

  let baseItems: Array<KeyValueItem> = []
  if (isFirstApplication(externalData)) {
    baseItems = [
      {
        width: 'half',
        keyText:
          medicalAndRehabilitationPaymentsFormMessage.generalInformation
            .questionsIsSelfEmployed,
        valueText:
          isSelfEmployed === YES
            ? socialInsuranceAdministrationMessage.shared.yes
            : socialInsuranceAdministrationMessage.shared.no,
      },
    ]
  }

  const calculatedRemunerationDateItem: Array<KeyValueItem> =
    isSelfEmployed === YES
      ? [
          {
            width: 'full',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .questionsCalculatedRemunerationDate,
            valueText: format(
              parseISO(calculatedRemunerationDate ?? ''),
              'dd.MM.yyyy',
              { locale: is },
            ),
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .questionsIsPartTimeEmployed,
      valueText:
        isPartTimeEmployed === YES
          ? socialInsuranceAdministrationMessage.shared.yes
          : socialInsuranceAdministrationMessage.shared.no,
    },
    {
      width: 'half',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .questionsIsStudying,
      valueText:
        isStudying === YES
          ? socialInsuranceAdministrationMessage.shared.yes
          : socialInsuranceAdministrationMessage.shared.no,
    },
  ]

  const isStudyingItems: Array<KeyValueItem> =
    isStudying === YES
      ? [
          {
            width: 'half',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .questionsSchool,
            valueText: educationalInstitution,
          },
          {
            width: 'half',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .questionsNumberOfCredits,
            valueText: ectsUnits,
          },
        ]
      : []

  return [
    ...baseItems,
    ...calculatedRemunerationDateItem,
    ...baseItems2,
    ...isStudyingItems,
  ]
}

export const employeeSickPayItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const { hasUtilizedEmployeeSickPayRights, employeeSickPayEndDate } =
    getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .employeeSickPayTitle,
      valueText: getYesNoNotApplicableTranslation(
        hasUtilizedEmployeeSickPayRights,
      ),
    },
  ]

  const employeeSickPayEndDateItem: Array<KeyValueItem> =
    hasUtilizedEmployeeSickPayRights !== NOT_APPLICABLE
      ? [
          {
            width: 'full',
            keyText: getSickPayEndDateLabel(hasUtilizedEmployeeSickPayRights),
            valueText: format(
              parseISO(employeeSickPayEndDate ?? ''),
              'dd.MM.yyyy',
              {
                locale: is,
              },
            ),
          },
        ]
      : []

  return [...baseItems, ...employeeSickPayEndDateItem]
}

export const unionSickPayItems = async (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
): Promise<KeyValueItem[]> => {
  const {
    hasUtilizedUnionSickPayRights,
    unionSickPayEndDate,
    unionNationalId,
  } = getApplicationAnswers(answers)

  const { data } = await apolloClient.query<SiaUnionsQuery>({
    query: siaUnionsQuery,
  })
  const unionName = data?.socialInsuranceGeneral?.unions?.find(
    (union) => union?.nationalId === unionNationalId,
  )?.name

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .unionSickPayTitle,
      valueText: getYesNoNotApplicableTranslation(
        hasUtilizedUnionSickPayRights,
      ),
    },
  ]

  const unionSickPayEndDateItems: Array<KeyValueItem> =
    hasUtilizedUnionSickPayRights !== NOT_APPLICABLE
      ? [
          {
            width: 'half',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .unionSickPayUnionSelectTitle,
            valueText: unionName ?? '',
          },
          {
            width: 'half',
            keyText: getSickPayEndDateLabel(hasUtilizedUnionSickPayRights),
            valueText: format(
              parseISO(unionSickPayEndDate ?? ''),
              'dd.MM.yyyy',
              {
                locale: is,
              },
            ),
          },
        ]
      : []

  return [...baseItems, ...unionSickPayEndDateItems]
}

export const rehabilitationPlanItems = (): Array<KeyValueItem> => [
  {
    width: 'full',
    keyText:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .sectionTitle,
    valueText:
      medicalAndRehabilitationPaymentsFormMessage.overview
        .rehabilitationPlanConfirmed,
  },
]

export const confirmedTreatmentItems = (): Array<KeyValueItem> => [
  {
    width: 'full',
    keyText:
      medicalAndRehabilitationPaymentsFormMessage.confirmedTreatment
        .sectionTitle,
    valueText:
      medicalAndRehabilitationPaymentsFormMessage.overview
        .confirmedTreatmentConfirmed,
  },
]

export const confirmationOfPendingResolutionItems = (): Array<KeyValueItem> => [
  {
    width: 'full',
    keyText:
      medicalAndRehabilitationPaymentsFormMessage
        .confirmationOfPendingResolution.sectionTitle,
    valueText:
      medicalAndRehabilitationPaymentsFormMessage.overview
        .confirmationOfPendingResolutionConfirmed,
  },
]

export const confirmationOfIllHealthItems = (): Array<KeyValueItem> => [
  {
    width: 'full',
    keyText:
      medicalAndRehabilitationPaymentsFormMessage.confirmationOfIllHealth
        .sectionTitle,
    valueText:
      medicalAndRehabilitationPaymentsFormMessage.overview
        .confirmationOfIllHealthConfirmed,
  },
]

export const selfAssessmentQuestionsOneItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { hadAssistance, educationalLevel } = getApplicationAnswers(answers)
  const { educationLevels } = getApplicationExternalData(externalData)
  const educationLevelOption = educationLevels.find(
    (level) => level.code === educationalLevel,
  )

  return [
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .hadAssistance,
      valueText:
        hadAssistance === YES
          ? socialInsuranceAdministrationMessage.shared.yes
          : socialInsuranceAdministrationMessage.shared.no,
    },
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .educationLevelDescription,
      valueText: educationLevelOption?.description,
    },
  ]
}

export const selfAssessmentQuestionsTwoItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const {
    currentEmploymentStatus,
    currentEmploymentStatusAdditional,
    lastEmploymentTitle,
    lastEmploymentYear,
  } = getApplicationAnswers(answers)

  const currentEmploymentStatusOptions =
    getSelfAssessmentCurrentEmploymentStatusOptions()

  const statuses = currentEmploymentStatus.map((status) => {
    return currentEmploymentStatusOptions.find(
      (option) => option.value === status,
    )?.label
  })

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .currentEmploymentStatusTitle,
      valueText: statuses,
    },
  ]

  const previousRehabilitationOrTreatmentItems: Array<KeyValueItem> =
    currentEmploymentStatus?.includes(
      SelfAssessmentCurrentEmploymentStatus.OTHER,
    )
      ? [
          {
            width: 'full',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                .furtherExplanation,
            valueText: currentEmploymentStatusAdditional,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.overview
          .selfAssessmentLastEmploymentTitle,
      valueText: lastEmploymentTitle,
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.overview
          .selfAssessmentLastEmploymentYear,
      valueText: lastEmploymentYear,
      hideIfEmpty: true,
    },
  ]

  return [
    ...baseItems,
    ...previousRehabilitationOrTreatmentItems,
    ...baseItems2,
  ]
}

export const selfAssessmentQuestionsThreeItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const {
    mainProblem,
    hasPreviouslyReceivedRehabilitationOrTreatment,
    previousRehabilitationOrTreatment,
    previousRehabilitationSuccessful,
    previousRehabilitationSuccessfulFurtherExplanations,
  } = getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .mainProblemTitle,
      valueText: mainProblem,
    },
    {
      width: 'full',
      keyText:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .hasPreviouslyReceivedRehabilitationOrTreatment,
      valueText:
        hasPreviouslyReceivedRehabilitationOrTreatment === YES
          ? socialInsuranceAdministrationMessage.shared.yes
          : socialInsuranceAdministrationMessage.shared.no,
    },
  ]

  const previousRehabilitationOrTreatmentItems: Array<KeyValueItem> =
    hasPreviouslyReceivedRehabilitationOrTreatment === YES
      ? [
          {
            width: 'full',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                .previousRehabilitationOrTreatment,
            valueText: previousRehabilitationOrTreatment,
          },
          {
            width: 'full',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                .previousRehabilitationSuccessful,
            valueText:
              previousRehabilitationSuccessful === YES
                ? socialInsuranceAdministrationMessage.shared.yes
                : socialInsuranceAdministrationMessage.shared.no,
          },
        ]
      : []

  const previousRehabilitationSuccessfulItem: Array<KeyValueItem> =
    hasPreviouslyReceivedRehabilitationOrTreatment === YES &&
    (previousRehabilitationSuccessful === YES ||
      previousRehabilitationSuccessful === NO)
      ? [
          {
            width: 'full',
            keyText:
              medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                .previousRehabilitationSuccessfulFurtherExplanations,
            valueText: previousRehabilitationSuccessfulFurtherExplanations,
          },
        ]
      : []

  return [
    ...baseItems,
    ...previousRehabilitationOrTreatmentItems,
    ...previousRehabilitationSuccessfulItem,
  ]
}

export const selfAssessmentQuestionnaireItems = (): Array<KeyValueItem> => [
  {
    width: 'full',
    keyText:
      medicalAndRehabilitationPaymentsFormMessage.overview
        .selfAssessmentQuestionnaire,
    valueText:
      medicalAndRehabilitationPaymentsFormMessage.overview
        .selfAssessmentQuestionnaireConfirmed,
  },
]

export const commentItems = (answers: FormValue): Array<KeyValueItem> => {
  const { comment } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText:
        socialInsuranceAdministrationMessage.additionalInfo.commentSection,
      valueText: comment,
    },
  ]
}
