import { paidWorkSubSection } from './paidWorkSubSection'
import { livedAbroadSubSection } from './livedAbroadSubSection'
import { abroadPaymentsSubSection } from './abroadPaymentsSubSection'
import { buildSubSection } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const employmentParticipationSubSection =
    buildSubSection({
      id: SectionRouteEnum.EMPLOYMENT_PARTICIPATION,
      title: disabilityPensionFormMessage.basicInfo.employmentParticipationTitle,
      children: [
        paidWorkSubSection,
        livedAbroadSubSection, //TODO - NOT READY - DATE PICK AND COUNTRY SELECT
        abroadPaymentsSubSection //TODO - NOT READY - COUNTRY SELECT
      ],
    })
