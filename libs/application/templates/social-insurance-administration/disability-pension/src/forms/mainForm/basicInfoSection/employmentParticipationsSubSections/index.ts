import { paidWorkSubSection } from './paidWorkSubSection'
import { livedAbroadSubSection } from './livedAbroadSubSection'
import { abroadPaymentsSubSection } from './abroadPaymentsSubSection'
import { buildSubSection } from '@island.is/application/core'
import { SectionRouteEnum } from '../../../../types/routes'
import * as m from '../../../../lib/messages'

export const employmentParticipationSubSection = buildSubSection({
  id: SectionRouteEnum.EMPLOYMENT_PARTICIPATION,
  title: m.basicInfo.employmentParticipationTitle,
  children: [
    paidWorkSubSection,
    livedAbroadSubSection,
    abroadPaymentsSubSection,
  ],
})
