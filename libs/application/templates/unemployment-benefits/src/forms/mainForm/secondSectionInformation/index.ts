import {
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { HandShake } from '@island.is/application/assets/graphics'

import { application as applicationMessages } from '../../../lib/messages'
export const secondSectionInformation = buildSection({
  id: 'secondSectionInformation',
  title: applicationMessages.secondSectionStepperTitle,
  children: [
    buildMultiField({
      id: 'secondSectionInformation',
      title: applicationMessages.secondSectionTitle,
      description: applicationMessages.secondSectionDescription,
      children: [
        buildImageField({
          id: 'secondSectionImage',
          image: HandShake,
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
