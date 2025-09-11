import { coreMessages, getValueViaPath, YES } from '@island.is/application/core'
import {
  FormValue,
  KeyValueItem,
  TableData,
} from '@island.is/application/types'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import kennitala from 'kennitala'

import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { getTaxLevelOption } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { disabilityPensionFormMessage } from '../lib/messages'
import { SectionRouteEnum } from '../types'

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
      valueText: kennitala.format(
        getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
      ),
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
          return getTaxLevelOption(index as TaxLevelOptions).defaultMessage
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
      valueText:
        getValueViaPath(
          answers,
          `${SectionRouteEnum.DISABILITY_CERTIFICATE}`,
        ) === undefined || null
          ? disabilityPensionFormMessage.disabilityCertificate
              .certificateNotAvailable
          : disabilityPensionFormMessage.disabilityCertificate
              .certificateAvailable,
    },
  ]
}

export const selfEvaluationItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: disabilityPensionFormMessage.selfEvaluation.title,

      valueText: () => {
        const backgroundData = getValueViaPath(
          answers,
          `${SectionRouteEnum.SELF_EVALUATION}`,
        )
        const impairmentData = getValueViaPath(
          answers,
          `${SectionRouteEnum.CAPABILITY_IMPAIRMENT}.questionAnswers`,
        )
        return ' :D '
      },
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

/*

export const getExamInformationOthersForOverview = (
  answers: FormValue,
): TableData => {
  const examinees = getExaminees(answers)
  const examCategories = getExamcategories(answers)

  if (!examinees || !examCategories) return { header: [], rows: [] }

  const tableData = examinees
    ?.map((examinee, index) => {
      return examCategories[index].categories.map((cat, idx) => {
        return {
          name: examinee.nationalId.name,
          examCategory: cat.label,
          instructor: examCategories[index].instructor[idx].label,
        }
      })
    })
    .flat()

  return {
    header: [
      overview.table.examinee,
      overview.table.examCategory,
      overview.table.instructor,
    ],
    rows: tableData.map((data) => {
      return [data.name, data.examCategory, data.instructor]
    }),
  }
}

*/
export const incomePlanItems = (answers: FormValue): TableData => {
  const incomePlanData = getValueViaPath(
    answers,
    `${SectionRouteEnum.INCOME_PLAN}`,
  )

  if (!Array.isArray(incomePlanData)) return { header: [], rows: [] }

  return {
    header: [
      disabilityPensionFormMessage.incomePlan.incomeType,
      disabilityPensionFormMessage.incomePlan.yearlyIncome,
      disabilityPensionFormMessage.incomePlan.currency,
    ],
    rows: incomePlanData.map((item) => {
      return [item.incomeType, item.yearlyIncome ?? '0', item.currency]
    }),
  }
}
