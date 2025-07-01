import { paidWorkSubSection } from './paidWorkSubSection'
import { livedAbroadSubSection } from './livedAbroadSubSection'
import { abroadPaymentsSubSection } from './abroadPaymentsSubSection'
import { buildSubSection } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../lib/routes'

export const employmentParticipationSubSection =
    buildSubSection({
      id: SectionRouteEnum.EMPLOYMENT_PARTICIPATION,
      title: disabilityPensionFormMessage.basicInfo.employmentParticipationTitle,
      children: [
        paidWorkSubSection,
        livedAbroadSubSection,
        abroadPaymentsSubSection
      ],
    })
