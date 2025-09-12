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
import { disabilityPensionFormMessage } from '../lib/messages'
import { SectionRouteEnum } from '../types'
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
      keyText: disabilityPensionFormMessage.personalInfo.address,
      valueText: getValueViaPath(answers, 'applicant.address'),
    },
    {
      width: 'half',
      keyText: disabilityPensionFormMessage.personalInfo.municipality,
      valueText: getValueViaPath(answers, 'applicant.city'),
    },
    {
      width: 'half',
      keyText: disabilityPensionFormMessage.personalInfo.email,
      valueText: getValueViaPath(answers, 'applicant.email'),
    },
    {
      width: 'half',
      keyText: disabilityPensionFormMessage.personalInfo.phone,
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
      keyText: disabilityPensionFormMessage.paymentInfo.bank,
      valueText: getValueViaPath(
        answers,
        `${SectionRouteEnum.PAYMENT_INFO}.bank`,
      ),
    },
    {
      width: 'half',
      keyText: disabilityPensionFormMessage.paymentInfo.personalAllowanceLabel,
      valueText:
        getValueViaPath<string>(
          answers,
          `${SectionRouteEnum.PAYMENT_INFO}.usePersonalAllowance`,
        ) === YES
          ? disabilityPensionFormMessage.paymentInfo.yes
          : disabilityPensionFormMessage.paymentInfo.no,
    },
    {
      width: 'half',
      keyText: disabilityPensionFormMessage.paymentInfo.personalAllowanceRatio,
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
      keyText: disabilityPensionFormMessage.paymentInfo.taxationLevel,
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
      keyText:
        disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeTitle,
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
      keyText:
        disabilityPensionFormMessage.employmentParticipation.inPaidWorkTitle,
      valueText: () => {
        const answer = getValueViaPath<string>(
          answers,
          `${SectionRouteEnum.EMPLOYMENT_PARTICIPATION}.inPaidWork`,
        )
        return answer === YES
          ? disabilityPensionFormMessage.employmentParticipation.yes
          : disabilityPensionFormMessage.employmentParticipation.no
      },
    },
    {
      width: 'full',
      keyText:
        disabilityPensionFormMessage.employmentParticipation.continuedWorkTitle,
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
      keyText:
        disabilityPensionFormMessage.disabilityCertificate.disabilityTitle,
      valueText: (() => {
        const certificate = getValueViaPath(
          answers,
          `${SectionRouteEnum.DISABILITY_CERTIFICATE}`,
        )
        return certificate == null || undefined
          ? disabilityPensionFormMessage.disabilityCertificate
              .certificateNotAvailable
          : disabilityPensionFormMessage.disabilityCertificate
              .certificateAvailable
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
      keyText: disabilityPensionFormMessage.extraInfo.title,
      valueText:
        value && value.trim() !== ''
          ? value
          : disabilityPensionFormMessage.extraInfo.noExtraInfo,
    },
  ]
}

export const incomePlanItems = (answers: FormValue): TableData => {
  const { incomePlan } = getApplicationAnswers(answers)

  if (!Array.isArray(incomePlan)) return { header: [], rows: [] }

  return {
    header: [
      disabilityPensionFormMessage.incomePlan.incomeType,
      disabilityPensionFormMessage.incomePlan.yearlyIncome,
      disabilityPensionFormMessage.incomePlan.currency,
    ],
    rows: incomePlan.map((e) => [
      e.incomeType,
      formatCurrencyWithoutSuffix(e.incomePerYear),
      e.currency,
    ]),
  }
}
