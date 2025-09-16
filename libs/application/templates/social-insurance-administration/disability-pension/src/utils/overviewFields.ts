import {
  buildOverviewField,
} from '@island.is/application/core'
import * as m from '../lib/messages'
import { SectionRouteEnum } from '../types/routes'
import {
  aboutApplicantItems,
  paymentInfoItems,
  incomePlanItems,
  appliedBeforeItems,
  employmentItems,
  extraInfoItems,
} from './overviewItems'
import { getApplicationAnswers } from '../utils'
import { hasSelfEvaluationAnswers } from './hasSelfEvaluationAnswers'
import { KeyValueItem } from '@island.is/application/types'


export const overviewFields = (editable?: boolean) => {
  return [
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.personalInfo`,
      backId: editable ? SectionRouteEnum.PERSONAL_INFO : undefined,
      items: aboutApplicantItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.paymentInfo`,
      backId: editable ? SectionRouteEnum.PAYMENT_INFO : undefined,
      items: paymentInfoItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.incomePlan`,
      title: m.incomePlan.instructionsTitle,
      hideIfEmpty: true,
      backId: editable ? SectionRouteEnum.INCOME_PLAN : undefined,
      tableData: incomePlanItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.appliedBefore`,
      hideIfEmpty: true,
      backId: editable ? SectionRouteEnum.DISABILITY_APPLIED_BEFORE : undefined,
      items: appliedBeforeItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.employment`,
      hideIfEmpty: true,
      backId: editable ? SectionRouteEnum.EMPLOYMENT_PARTICIPATION : undefined,
      items: employmentItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.disabilityCertificate`,
      title: m.customFields.certificate,
      items: () => {
        return [
          {
            width: 'full',
            value: 'Til staðar er vottorð um örorku',
          },
        ]
      },
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.selfEvaluation`,
      title: m.selfEvaluation.title,
      titleVariant: 'h4',
      backId: SectionRouteEnum.SELF_EVALUATION,
      items: (
        answers,
      )  => {
        const {
          hadAssistanceForSelfEvaluation,
          questionnaire
        } = getApplicationAnswers(answers)

        const hasAnsweredSelfEvalution = hasSelfEvaluationAnswers(answers)

        const hasCapabilityImpairment = questionnaire.find(
          (question) => question.answer !== undefined,
        )

        return ([
          {
            width: 'full',
            value: hadAssistanceForSelfEvaluation !== undefined ? m.selfEvaluation.applicantHasAnsweredAssistance : m.selfEvaluation.applicantHasNotAnsweredAssistance
          },
          hasAnsweredSelfEvalution && {
            width: 'full',
            value: m.selfEvaluation.applicantHasAnsweredSelfEvaluation
          },
          hasCapabilityImpairment && {
            width: 'full',
            value: m.selfEvaluation.applicantHasAnsweredCapabilityImpairment
          }
        ].filter(Boolean) as Array<KeyValueItem> | undefined) ?? []
      },
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.extraInfo`,
      backId: editable ? SectionRouteEnum.EXTRA_INFO : undefined,
      hideIfEmpty: true,
      items: extraInfoItems,
    }),
  ]
}
