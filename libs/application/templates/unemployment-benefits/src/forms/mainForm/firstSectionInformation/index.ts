import {
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { sectionImage } from '../../../assets/sectionImage'

import { application as applicationMessages } from '../../../lib/messages'
export const firstSectionInformation = buildSection({
  id: 'firstSection',
  children: [
    buildMultiField({
      id: 'firstSection',
      title: applicationMessages.firstSectionTitle,
      description: applicationMessages.firstSectionDescription,
      children: [
        buildImageField({
          id: 'firstSectionImage',
          image: sectionImage,
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
