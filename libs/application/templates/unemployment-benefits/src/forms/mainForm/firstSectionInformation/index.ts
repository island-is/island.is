import {
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { HandShake } from '@island.is/application/assets/graphics'

import { application as applicationMessages } from '../../../lib/messages'
export const firstSectionInformation = buildSection({
  id: 'firstSection',
  title: applicationMessages.firstSectionStepperTitle,
  children: [
    buildMultiField({
      id: 'firstSection',
      title: applicationMessages.firstSectionTitle,
      description: applicationMessages.firstSectionDescription,
      children: [
        buildImageField({
          id: 'firstSectionImage',
          image: HandShake,
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
