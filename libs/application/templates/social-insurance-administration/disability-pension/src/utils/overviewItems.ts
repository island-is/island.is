import { coreMessages, YES } from '@island.is/application/core'
import {
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
import { formatBankAccount, getTaxLevelOption } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import * as m from '../lib/messages'
import { getApplicationAnswers } from './getApplicationAnswers'
import { hasSelfEvaluationAnswers } from './hasSelfEvaluationAnswers'

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
      width: 'full',
      keyText: m.paymentInfo.bank,
<<<<<<< HEAD
      valueText: formatBankAccount(paymentInfo)
=======
      valueText: paymentInfo?.bank,
>>>>>>> refs/remotes/origin/feat/disability-pension-application
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
      width: 'full',
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

export const appliedBeforeItems = (answers: FormValue): Array<KeyValueItem> => {
  const { hasAppliedForDisabilityBefore } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: m.disabilityEvaluation.appliedBeforeTitle,
      valueText: hasAppliedForDisabilityBefore
        ? coreMessages.radioYes
        : coreMessages.radioNo,
    },
  ]
}

export const employmentItems = (answers: FormValue): Array<KeyValueItem> => {
  const { inPaidWork, willContinueWorking } = getApplicationAnswers(answers)
  return [
    {
      width: 'full',
      keyText: m.employmentParticipation.inPaidWorkTitle,
      valueText: () =>
        inPaidWork
          ? m.employmentParticipation.yes
          : m.employmentParticipation.no,
    },
    {
      width: 'full',
      keyText: m.employmentParticipation.continuedWorkTitle,
      valueText: willContinueWorking
        ? coreMessages.radioYes
        : coreMessages.radioNo,
    },
  ]
}

export const selfEvaluationItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const { hadAssistanceForSelfEvaluation, questionnaire } =
    getApplicationAnswers(answers)

  const hasAnsweredSelfEvalution = hasSelfEvaluationAnswers(answers)

  const hasCapabilityImpairment = questionnaire.find(
    (question) => question.answer !== undefined,
  )

  return [
    {
      width: 'full',
      valueText: hadAssistanceForSelfEvaluation !== undefined ? m.selfEvaluation.applicantHasAnsweredAssistance : m.selfEvaluation.applicantHasNotAnsweredAssistance
    },
    hasAnsweredSelfEvalution && {
      width: 'full',
      valueText: m.selfEvaluation.applicantHasAnsweredSelfEvaluation
    },
    hasCapabilityImpairment && {
      width: 'full',
      valueText: m.selfEvaluation.applicantHasAnsweredCapabilityImpairment
    }
  ].filter(Boolean) as KeyValueItem[]
}

export const extraInfoItems = (answers: FormValue): Array<KeyValueItem> => {
  const { extraInfo } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
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
      formatCurrencyWithoutSuffix(e.incomePerYear),
      e.currency,
    ]),
  }
}
