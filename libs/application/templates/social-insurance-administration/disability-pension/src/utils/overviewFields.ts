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
      backId: editable ? SectionRouteEnum.DISABILITY_CERTIFICATE : undefined,
      items: () => {
        return [
          {
            width: 'full',
            keyText: m.customFields.certificate,
            valueText: m.disabilityCertificate.certificateAvailable,
          },
        ]
      },
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.selfEvaluation`,
      backId: editable ? SectionRouteEnum.SELF_EVALUATION : undefined,
      items: selfEvaluationItems,
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.extraInfo`,
      backId: editable ? SectionRouteEnum.EXTRA_INFO : undefined,
      hideIfEmpty: true,
      items: extraInfoItems,
    }),
  ]
}
