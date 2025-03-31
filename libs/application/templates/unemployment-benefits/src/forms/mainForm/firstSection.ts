import {
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { firstSectionImage } from '../../assets/firstSectionImage'

import { application as applicationMessages } from '../../lib/messages'
export const firstSection = buildSection({
  id: 'firstSection',
  title: 'First section',
  children: [
    buildMultiField({
      id: 'firstSection',
      title: applicationMessages.firstSectionTitle,
      description: applicationMessages.firstSectionDescription,
      children: [
        buildImageField({
          id: 'firstSectionImage',
          image: firstSectionImage,
        }),
      ],
    }),
  ],
})
