import { paidWorkSubSection } from './paidWorkSubSection'
import { livedAbroadSubSection } from './livedAbroadSubSection'
import { abroadPaymentsSubSection } from './abroadPaymentsSubSection'
import { buildSubSection } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'

export const employmentParticipationSubSection =
    buildSubSection({
      id: 'employmentParticipation',
      title: disabilityPensionFormMessage.basicInfo.employmentParticipationTitle,
      children: [
        paidWorkSubSection,
        livedAbroadSubSection,
        abroadPaymentsSubSection
      ],
    })
