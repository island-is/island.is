import {
  buildCustomField,
  buildMultiField,
  buildOverviewField,
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import {
  aboutApplicantItems,
  appliedBeforeItems,
  disabilityCertificateItems,
  employmentItems,
  extraInfoItems,
  incomePlanItems,
  paymentInfoItems,
  selfEvaluationItems,
} from '../../../utils/overviewItems'

export const overviewSection = buildSection({
  id: SectionRouteEnum.OVERVIEW,
  title: disabilityPensionFormMessage.overview.title,
  children: [
    buildMultiField({
      id: `${SectionRouteEnum.OVERVIEW}.multiFields`,
      title: disabilityPensionFormMessage.overview.title,
      description: disabilityPensionFormMessage.overview.description,
      space: 'containerGutter',
      nextButtonText: disabilityPensionFormMessage.overview.sendInApplication,
      children: [
        buildOverviewField({
          id: `${SectionRouteEnum.OVERVIEW}.personalInfo`,
          backId: SectionRouteEnum.PERSONAL_INFO,
          items: aboutApplicantItems,
        }),
        buildOverviewField({
          id: `${SectionRouteEnum.OVERVIEW}.paymentInfo`,
          backId: SectionRouteEnum.PAYMENT_INFO,
          items: paymentInfoItems,
        }),
        buildOverviewField({
          id: `${SectionRouteEnum.OVERVIEW}.incomePlan`,
          title: disabilityPensionFormMessage.incomePlan.instructionsTitle,
          hideIfEmpty: true,
          backId: SectionRouteEnum.INCOME_PLAN,
          tableData: incomePlanItems,
        }),
        buildOverviewField({
          id: `${SectionRouteEnum.OVERVIEW}.appliedBefore`,
          hideIfEmpty: true,
          backId: SectionRouteEnum.DISABILITY_APPLIED_BEFORE,
          items: appliedBeforeItems,
        }),
        buildOverviewField({
          id: `${SectionRouteEnum.OVERVIEW}.employment`,
          hideIfEmpty: true,
          backId: SectionRouteEnum.EMPLOYMENT_PARTICIPATION,
          items: employmentItems,
        }),
        buildOverviewField({
          id: `${SectionRouteEnum.OVERVIEW}.disabilityCertificate`,
          hideIfEmpty: true,
          backId: SectionRouteEnum.DISABILITY_CERTIFICATE,
          items: disabilityCertificateItems,
        }),
        buildCustomField({
          id: `${SectionRouteEnum.OVERVIEW}.customField`,
          title: 'Custom self evaluation',
          component: 'Review',
        }),
        buildOverviewField({
          id: `${SectionRouteEnum.OVERVIEW}.extraInfo`,
          backId: SectionRouteEnum.EXTRA_INFO,
          hideIfEmpty: true,
          items: extraInfoItems,
        }),
      ],
    }),
  ],
})
