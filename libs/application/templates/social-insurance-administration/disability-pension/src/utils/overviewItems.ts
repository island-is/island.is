import { coreMessages, getValueViaPath, YES } from '@island.is/application/core'
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
import { getTaxLevelOption } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import * as m from '../lib/messages'
import { SectionRouteEnum } from '../types/routes'
import { getApplicationAnswers } from './getApplicationAnswers'

export const aboutApplicantItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: coreMessages.name,
      valueText: getValueViaPath(answers, 'applicant.name'),
    },
    {
      width: 'half',
      keyText: coreMessages.nationalId,
      valueText: (() => {
        const kt = getValueViaPath<string>(answers, 'applicant.nationalId')
        return kt ? kennitala.format(kt) : ''
      })(),
    },
    {
      width: 'half',
      keyText: m.personalInfo.address,
      valueText: getValueViaPath(answers, 'applicant.address'),
    },
    {
      width: 'half',
      keyText: m.personalInfo.municipality,
      valueText: getValueViaPath(answers, 'applicant.city'),
    },
    {
      width: 'half',
      keyText: m.personalInfo.email,
      valueText: getValueViaPath(answers, 'applicant.email'),
    },
    {
      width: 'half',
      keyText: m.personalInfo.phone,
      valueText: formatPhoneNumber(
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
      ),
    },
  ]
}

export const paymentInfoItems = (answers: FormValue): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.paymentInfo.bank,
      valueText: getValueViaPath(
        answers,
        `${SectionRouteEnum.PAYMENT_INFO}.bank`,
      ),
    },
    {
      width: 'half',
      keyText: m.paymentInfo.personalAllowanceLabel,
      valueText:
        getValueViaPath<string>(
          answers,
          `${SectionRouteEnum.PAYMENT_INFO}.usePersonalAllowance`,
        ) === YES
          ? m.paymentInfo.yes
          : m.paymentInfo.no,
    },
    {
      width: 'half',
      keyText: m.paymentInfo.personalAllowanceRatio,
      valueText: () => {
        const personalAllowanceUsage = getValueViaPath<string>(
          answers,
          `${SectionRouteEnum.PAYMENT_INFO}.personalAllowanceUsage`,
        )
        return personalAllowanceUsage ? `${personalAllowanceUsage} %` : '0%'
      },
    },
    {
      width: 'full',
      keyText: m.paymentInfo.taxationLevel,
      valueText: (() => {
        const index = getValueViaPath(
          answers,
          `${SectionRouteEnum.PAYMENT_INFO}.taxLevel`,
        )
        if (Object.values(TaxLevelOptions).includes(index as TaxLevelOptions)) {
          return getTaxLevelOption(index as TaxLevelOptions)
        }
        return typeof index === 'string' ? index : ''
      })(),
    },
  ]
}

export const appliedBeforeItems = (answers: FormValue): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.disabilityEvaluation.appliedBeforeTitle,
      valueText:
        getValueViaPath<string>(
          answers,
          `${SectionRouteEnum.DISABILITY_APPLIED_BEFORE}.appliedBefore`,
        ) === YES
          ? coreMessages.radioYes
          : coreMessages.radioNo,
    },
  ]
}

export const employmentItems = (answers: FormValue): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.employmentParticipation.inPaidWorkTitle,
      valueText: () => {
        const answer = getValueViaPath<string>(
          answers,
          `${SectionRouteEnum.EMPLOYMENT_PARTICIPATION}.inPaidWork`,
        )
        return answer === YES
          ? m.employmentParticipation.yes
          : m.employmentParticipation.no
      },
    },
    {
      width: 'full',
      keyText: m.employmentParticipation.continuedWorkTitle,
      valueText:
        getValueViaPath<string>(
          answers,
          `${SectionRouteEnum.EMPLOYMENT_PARTICIPATION}.continuedWork`,
        ) === YES
          ? coreMessages.radioYes
          : coreMessages.radioNo,
    },
  ]
}

export const disabilityCertificateItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.disabilityCertificate.disabilityTitle,
      valueText: (() => {
        const certificate = getValueViaPath(
          answers,
          `${SectionRouteEnum.DISABILITY_CERTIFICATE}`,
        )
        return certificate == null || undefined
          ? m.disabilityCertificate.certificateNotAvailable
          : m.disabilityCertificate.certificateAvailable
      })(),
    },
  ]
}

export const extraInfoItems = (answers: FormValue): Array<KeyValueItem> => {
  const value = getValueViaPath<string>(
    answers,
    `${SectionRouteEnum.EXTRA_INFO}`,
  )?.toString()

  return [
    {
      width: 'full',
      keyText: m.extraInfo.title,
      valueText: value && value.trim() !== '' ? value : m.extraInfo.noExtraInfo,
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
