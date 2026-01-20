import { buildOverviewField } from '@island.is/application/core'
import * as m from '../lib/messages'
import { SectionRouteEnum } from '../types/routes'
import {
  aboutApplicantItems,
  paymentInfoItems,
  incomePlanItems,
  appliedBeforeItems,
  employmentItems,
  extraInfoItems,
  capabilityImpairmentItems,
  disabilityPeriodItems,
  livedAbroadItems,
  livedAbroadTableItems,
  abroadPaymentsTableItems,
  abroadPaymentsItems,
  selfEvaluationItems,
} from './overviewItems'

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
      titleVariant: 'h4',
      hideIfEmpty: true,
      backId: editable ? SectionRouteEnum.INCOME_PLAN : undefined,
      tableData: incomePlanItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.disabilityPeriod`,
      backId: editable ? SectionRouteEnum.DISABILITY_PERIOD : undefined,
      items: disabilityPeriodItems,
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
      id: `${SectionRouteEnum.OVERVIEW}.livedAbroad`,
      backId: editable ? SectionRouteEnum.LIVED_ABROAD : undefined,
      items: livedAbroadItems,
      tableData: livedAbroadTableItems,
      bottomLine: false,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.abroadPayments`,
      backId: editable ? SectionRouteEnum.ABROAD_PAYMENT : undefined,
      items: abroadPaymentsItems,
      tableData: abroadPaymentsTableItems,
      bottomLine: false,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.selfEvaluation`,
      backId: editable ? SectionRouteEnum.SELF_EVALUATION : undefined,
      title: m.selfEvaluation.questionFormTitle,
      loadItems: selfEvaluationItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.capabilityImpairment`,
      backId: editable ? SectionRouteEnum.CAPABILITY_IMPAIRMENT : undefined,
      items: capabilityImpairmentItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.disabilityCertificate`,
      backId: editable ? SectionRouteEnum.DISABILITY_CERTIFICATE : undefined,
      items: () => {
        return [
          {
            width: 'full',
            keyText: m.certificate.title,
            valueText: m.certificate.available,
          },
        ]
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
