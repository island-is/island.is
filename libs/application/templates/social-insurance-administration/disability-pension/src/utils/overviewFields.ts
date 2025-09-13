import {
  buildOverviewField,
  buildCustomField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../lib/messages'
import { SectionRouteEnum } from '../types'
import {
  aboutApplicantItems,
  paymentInfoItems,
  incomePlanItems,
  appliedBeforeItems,
  employmentItems,
  extraInfoItems,
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
      title: disabilityPensionFormMessage.incomePlan.instructionsTitle,
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
    buildCustomField({
      id: `${SectionRouteEnum.OVERVIEW}.disabilityCertificate`,
      title:
        disabilityPensionFormMessage.customFields.certificate ??
        'Custom disability certificate',

      component: 'CertificateOverview',
    }),
    buildCustomField({
      id: `${SectionRouteEnum.OVERVIEW}.customField`,
      title:
        disabilityPensionFormMessage.customFields.selfEvaluation ??
        'Custom self evaluation',
      component: 'Review',
    }),
    buildOverviewField({
      id: `${SectionRouteEnum.OVERVIEW}.extraInfo`,
      backId: editable ? SectionRouteEnum.EXTRA_INFO : undefined,
      hideIfEmpty: true,
      items: extraInfoItems,
    }),
  ]
}
