import {
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { sectionImage } from '../../../assets/sectionImage'

import { application as applicationMessages } from '../../../lib/messages'
export const secondSectionInformation = buildSection({
  id: 'secondSectionInformation',
  children: [
    buildMultiField({
      id: 'secondSectionInformation',
      title: applicationMessages.secondSectionTitle,
      description: applicationMessages.secondSectionDescription,
      children: [
        buildImageField({
          id: 'secondSectionImage',
          image: sectionImage,
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
