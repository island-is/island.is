import { ApolloClient } from '@apollo/client'
import { NO, YES } from '@island.is/application/core'
import { siaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/graphql/queries'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  bankInfoToString,
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
import { NOT_APPLICABLE } from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
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
    applicantMunicipality,
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
      valueText: applicantAddress,
    },
    {
      width: 'half',
      keyText: socialInsuranceAdministrationMessage.confirm.municipality,
      valueText: applicantMunicipality,
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
  const { bank, personalAllowance, personalAllowanceUsage, taxLevel } =
    getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: socialInsuranceAdministrationMessage.payment.bank,
      valueText: bankInfoToString(bank),
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

export const questionsItems = (answers: FormValue): Array<KeyValueItem> => {
  const {
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
  } = getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
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

  return [...baseItems, ...calculatedRemunerationDateItem, ...baseItems2]
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
  const unionName = data?.socialInsuranceUnions.find(
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

export const selfAssessmentQuestionsOneItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const { hadAssistance, highestLevelOfEducation } =
    getApplicationAnswers(answers)

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
          .highestlevelOfEducationDescription,
      valueText: highestLevelOfEducation,
    },
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
    keyText: medicalAndRehabilitationPaymentsFormMessage.selfAssessment.title,
    valueText:
      medicalAndRehabilitationPaymentsFormMessage.overview
        .selfAssessmentConfirmed,
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
