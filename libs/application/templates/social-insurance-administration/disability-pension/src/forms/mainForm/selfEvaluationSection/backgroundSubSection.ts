import {
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'

const backgroundRoute = 'backgroundInfo'

export const backgroundSubSection =
    buildSubSection({
      id: backgroundRoute,
      tabTitle: disabilityPensionFormMessage.backgroundInfo.title,
      title: disabilityPensionFormMessage.backgroundInfo.description,
      children: [
        buildMultiField({
          id: backgroundRoute,
          children: []
        }),
      ],
    })
