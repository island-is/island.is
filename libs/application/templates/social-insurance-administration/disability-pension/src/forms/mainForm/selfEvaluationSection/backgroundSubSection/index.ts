import {
    buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { YesOrNoOptions } from '../../../lib/utils'

export const backgroundRoute = 'background'

export const  backgroundSubSection =
      buildSubSection({
        id: 'employmentParticipation',
        title: disabilityPensionFormMessage.basicInfo.employmentParticipationTitle,
        children: [
        ],
      })
