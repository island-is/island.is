import { coreMessages, YES } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
  TableData,
} from '@island.is/application/types'
import {
  formatCurrencyWithoutSuffix,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import kennitala from 'kennitala'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  formatBankAccount,
  getTaxLevelOption,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import * as m from '../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from './getApplicationAnswers'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import isValid from 'date-fns/isValid'
import {
  generateChildrenOptions,
  generateEmploymentImportanceOptions,
  generateIcelandicCapabilityOptions,
} from './options'
import { ApolloClient } from '@apollo/client'
import {
  siaGeneralLanguagesQuery,
  siaGeneralProfessionActivitiesQuery,
  siaGeneralProfessionsQuery,
} from '../graphql/queries'
import {
  OTHER_RESIDENCE_STATUS_VALUE,
  OTHER_STATUS_VALUE,
} from '../types/constants'
import { Query } from '@island.is/api/schema'

export const aboutApplicantItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantCity,
    applicantEmail,
    applicantPhonenumber,
  } = getApplicationAnswers(answers)
  return [
    {
      width: 'half',
      keyText: coreMessages.name,
      valueText: applicantName,
    },
    {
      width: 'half',
      keyText: coreMessages.nationalId,
      valueText: (() => {
        return applicantNationalId ? kennitala.format(applicantNationalId) : ''
      })(),
    },
    {
      width: 'half',
      keyText: m.personalInfo.address,
      valueText: applicantAddress,
    },
    {
      width: 'half',
      keyText: m.personalInfo.municipality,
      valueText: applicantCity,
    },
    {
      width: 'half',
      keyText: m.personalInfo.email,
      valueText: applicantEmail,
    },
    {
      width: 'half',
      keyText: m.personalInfo.phone,
      valueText: formatPhoneNumber(applicantPhonenumber),
    },
  ]
}

export const paymentInfoItems = (answers: FormValue): Array<KeyValueItem> => {
  const { paymentInfo, personalAllowance, personalAllowanceUsage, taxLevel } =
    getApplicationAnswers(answers)

  return [
    {
      width: 'full' as const,
      keyText: m.paymentInfo.bank,
      valueText: formatBankAccount(paymentInfo),
    },
    {
      width: 'half',
      keyText: m.paymentInfo.personalAllowanceLabel,
      valueText:
        personalAllowance === YES ? m.paymentInfo.yes : m.paymentInfo.no,
    },
    {
      width: 'half',
      keyText: m.paymentInfo.personalAllowanceRatio,
      valueText: () => {
        return personalAllowanceUsage ? `${personalAllowanceUsage} %` : '0%'
      },
    },
    {
      width: 'full' as const,
      keyText: m.paymentInfo.taxationLevel,
      valueText: () => {
        if (
          Object.values(TaxLevelOptions).includes(taxLevel as TaxLevelOptions)
        ) {
          return getTaxLevelOption(taxLevel as TaxLevelOptions)
        }
        return typeof taxLevel === 'string' ? taxLevel : ''
      },
    },
  ]
}

export const disabilityPeriodItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const { disabilityRenumerationDateMonth, disabilityRenumerationDateYear } =
    getApplicationAnswers(answers)

  if (!disabilityRenumerationDateYear || !disabilityRenumerationDateMonth) {
    return []
  }

  return [
    {
      width: 'full' as const,
      keyText: m.disabilityPeriod.chosenDate,
      valueText: () => {
        const year = Number.parseInt(disabilityRenumerationDateYear)
        const month = Number.parseInt(disabilityRenumerationDateMonth)
        const chosenDate = new Date(year, month)
        const date = isValid(chosenDate)
          ? format(chosenDate, 'MMMM yyyy', { locale: is })
          : ''

        return date
      },
    },
  ]
}

export const livedAbroadItems = (answers: FormValue): Array<KeyValueItem> => {
  const { hasLivedAbroad } = getApplicationAnswers(answers)

  return [
    {
      width: 'full' as const,
      keyText: m.employmentParticipation.livedAbroadQuestion,
      valueText:
        hasLivedAbroad === 'yes' ? coreMessages.radioYes : coreMessages.radioNo,
    },
  ]
}

export const livedAbroadTableItems = (answers: FormValue): TableData => {
  const { livedAbroadList, hasLivedAbroad } = getApplicationAnswers(answers)

  if (
    hasLivedAbroad !== YES ||
    !livedAbroadList ||
    livedAbroadList.length < 1
  ) {
    return {
      header: [],
      rows: [],
    }
  }

  return {
    header: [
      m.employmentParticipation.country,
      m.employmentParticipation.abroadNationalId,
      m.employmentParticipation.period,
    ],
    rows: livedAbroadList
      .map((item) => {
        const start = parseISO(item.periodStart)
        const end = parseISO(item.periodEnd)

        if (!isValid(start) || !isValid(end)) {
          return undefined
        }

        const formattedDateStart = format(start, 'MMMM yyyy')
        const formattedDateEnd = format(end, 'MMMM yyyy')

        return [
          item.countryDisplay,
          item.abroadNationalId ?? '-',
          `${formattedDateStart} - ${formattedDateEnd}`,
        ]
      })
      .filter(Boolean) as string[][],
  }
}
export const abroadPaymentsItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const { isReceivingBenefitsFromAnotherCountry } =
    getApplicationAnswers(answers)

  return [
    {
      width: 'full' as const,
      keyText: m.employmentParticipation.abroadPaymentsTitle,
      valueText:
        isReceivingBenefitsFromAnotherCountry === 'yes'
          ? coreMessages.radioYes
          : coreMessages.radioNo,
    },
  ]
}

export const abroadPaymentsTableItems = (answers: FormValue): TableData => {
  const { isReceivingBenefitsFromAnotherCountry, countries } =
    getApplicationAnswers(answers)

  if (
    isReceivingBenefitsFromAnotherCountry !== YES ||
    !countries ||
    countries.length < 1
  ) {
    return {
      header: [],
      rows: [],
    }
  }

  return {
    header: [
      m.employmentParticipation.country,
      m.employmentParticipation.abroadNationalId,
    ],
    rows: countries.map((item) => [item.countryDisplay, item.abroadNationalId]),
  }
}

export const appliedBeforeItems = (answers: FormValue): Array<KeyValueItem> => {
  const { hasAppliedForDisabilityBefore } = getApplicationAnswers(answers)

  return [
    {
      width: 'full' as const,
      keyText: m.disabilityEvaluation.appliedBeforeTitle,
      valueText:
        hasAppliedForDisabilityBefore === 'yes'
          ? coreMessages.radioYes
          : coreMessages.radioNo,
    },
  ]
}

export const employmentItems = (answers: FormValue): Array<KeyValueItem> => {
  const { inPaidWork, willContinueWorking } = getApplicationAnswers(answers)
  return [
    {
      width: 'full' as const,
      keyText: m.employmentParticipation.inPaidWorkTitle,
      valueText: () =>
        inPaidWork === 'yes'
          ? m.employmentParticipation.yes
          : m.employmentParticipation.no,
    },
    {
      width: 'full' as const,
      keyText: m.employmentParticipation.continuedWorkTitle,
      valueText:
        willContinueWorking === 'yes'
          ? coreMessages.radioYes
          : coreMessages.radioNo,
    },
  ]
}

export const selfEvaluationItems = async (
  answers: FormValue,
  externalData: ExternalData,
  _: string,
  apolloClient: ApolloClient<object>,
): Promise<Array<KeyValueItem>> => {
  const {
    biggestIssue,
    children,
    educationLevel,
    employmentCapability,
    employmentImportance,
    employmentStatus,
    employmentStatusOther,
    icelandicCapability,
    language,
    maritalStatus,
    previousEmployment,
    hasHadRehabilitationOrTherapy,
    rehabilitationOrTherapyResults,
    rehabilitationOrTherapyDescription,
    residence,
    residenceExtraComment,
    hadAssistanceForSelfEvaluation,
  } = getApplicationAnswers(answers)

  const {
    maritalStatuses = [],
    residenceTypes = [],
    employmentTypes = [],
    educationLevels = [],
  } = getApplicationExternalData(externalData)

  const [languageData, employmentJobData, employmentFieldData] =
    await Promise.all([
      apolloClient.query<Query>({
        query: siaGeneralLanguagesQuery,
      }),
      apolloClient.query<Query>({
        query: siaGeneralProfessionsQuery,
      }),
      apolloClient.query<Query>({
        query: siaGeneralProfessionActivitiesQuery,
      }),
    ])

  return [
    {
      width: 'full' as const,
      keyText: m.selfEvaluation.assistance,
      valueText:
        hadAssistanceForSelfEvaluation !== undefined
          ? hadAssistanceForSelfEvaluation === YES
            ? coreMessages.radioYes
            : coreMessages.radioNo
          : m.selfEvaluation.applicantHasNotAnsweredAssistance,
    },
    {
      width: 'full' as const,
      keyText: m.questions.maritalStatusTitle,
      valueText: maritalStatuses.find(
        (m) => m.value.toString() === maritalStatus,
      )?.label,
    },
    {
      width: 'full' as const,
      keyText: m.questions.residenceTitle,
      valueText: () => {
        if (residence && Number(residence) === OTHER_RESIDENCE_STATUS_VALUE) {
          return residenceExtraComment
        }
        return residenceTypes.find((m) => m.value.toString() === residence)
          ?.label
      },
    },
    {
      width: 'full' as const,
      keyText: m.questions.childrenCountTitle,
      valueText: generateChildrenOptions(m).find((g) => g.value === children)
        ?.label,
    },
    {
      width: 'full' as const,
      keyText: m.questions.icelandicCapabilityTitle,
      valueText: generateIcelandicCapabilityOptions(m).find(
        (g) => g.value === icelandicCapability,
      )?.label,
    },
    {
      width: 'full' as const,
      keyText: m.questions.languageTitle,
      valueText: languageData?.data.socialInsuranceGeneral.languages?.find(
        (l) => l.value === language,
      )?.label,
    },
    {
      width: 'full' as const,
      keyText: m.questions.employmentStatusTitle,
      valueText: () => {
        return Array.isArray(employmentStatus)
          ? employmentStatus.map((e) => {
              if (e === OTHER_STATUS_VALUE) {
                return employmentStatusOther
              }
              const label = employmentTypes.find((et) => et.value === e)?.label
              return `${label}\n\n`
            })
          : undefined
      },
    },
    {
      width: 'full' as const,
      keyText: m.questions.previousEmploymentTitle,
      valueText:
        previousEmployment?.hasEmployment === 'yes'
          ? coreMessages.radioYes
          : coreMessages.radioNo,
    },
    {
      width: 'full' as const,
      keyText: m.questions.previousEmploymentWhen,
      valueText: previousEmployment?.when,
      hideIfEmpty: true,
    },
    {
      width: 'full' as const,
      keyText: m.questions.previousEmploymentJob,
      valueText:
        employmentJobData?.data.socialInsuranceGeneral.professions?.find(
          (p) => p.value === previousEmployment?.job,
        )?.label,
      hideIfEmpty: true,
    },
    {
      width: 'full' as const,
      keyText: m.questions.previousEmploymentField,
      valueText:
        employmentFieldData?.data.socialInsuranceGeneral.professionActivities?.find(
          (p) => p.value === previousEmployment?.field,
        )?.label,
      hideIfEmpty: true,
    },
    {
      width: 'full' as const,
      keyText: m.questions.educationLevelTitle,
      valueText: educationLevels.find((e) => e.code === educationLevel)
        ?.description,
    },
    {
      width: 'full' as const,
      keyText: m.questions.employmentCapabilityTitle,
      valueText: employmentCapability ? `${employmentCapability}%` : undefined,
      hideIfEmpty: true,
    },
    {
      width: 'full' as const,
      keyText: m.questions.employmentImportanceTitle,
      valueText: generateEmploymentImportanceOptions(m).find(
        (e) => e.value === employmentImportance,
      )?.label,
    },
    {
      width: 'full' as const,
      keyText: m.questions.rehabilitationOrTherapyTitle,
      valueText:
        hasHadRehabilitationOrTherapy === 'yes'
          ? coreMessages.radioYes
          : coreMessages.radioNo,
    },
    {
      width: 'full' as const,
      keyText: m.questions.rehabilitationOrTherapyDescription,
      valueText: rehabilitationOrTherapyDescription,
      hideIfEmpty: true,
    },
    {
      width: 'full' as const,
      keyText: m.questions.rehabilitationOrTherapyResults,
      valueText: rehabilitationOrTherapyResults,
      hideIfEmpty: true,
    },
    {
      width: 'full' as const,
      keyText: m.questions.biggestIssueTitle,
      valueText: biggestIssue,
      hideIfEmpty: true,
    },
  ]
}

export const capabilityImpairmentItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const { questionnaire } = getApplicationAnswers(answers)

  const hasCapabilityImpairment = questionnaire.find(
    (question) => question.answer !== undefined,
  )

  return hasCapabilityImpairment
    ? [
        {
          width: 'full' as const,
          keyText: m.capabilityImpairment.title,
          valueText: m.selfEvaluation.applicantHasAnsweredCapabilityImpairment,
        },
      ]
    : []
}

export const extraInfoItems = (answers: FormValue): Array<KeyValueItem> => {
  const { extraInfo } = getApplicationAnswers(answers)

  if (!extraInfo) return []
  return [
    {
      width: 'full' as const,
      keyText: m.extraInfo.title,
      valueText:
        extraInfo && extraInfo.trim() !== ''
          ? extraInfo
          : m.extraInfo.noExtraInfo,
    },
  ]
}

export const incomePlanItems = (answers: FormValue): TableData => {
  const { incomePlan } = getApplicationAnswers(answers)

  if (!Array.isArray(incomePlan)) return { header: [], rows: [] }

  return {
    header: [
      m.incomePlan.incomeType,
      m.incomePlan.yearlyIncome,
      m.incomePlan.currency,
    ],
    rows: incomePlan.map((e) => [
      e.incomeType,
      formatCurrencyWithoutSuffix(e.incomePerYear) ?? 0,
      e.currency,
    ]),
  }
}
