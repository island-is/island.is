import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const postponedIntroSection = buildSection({
  id: 'postponedIntro',
  title: messages.postponed.introSectionTitle,
  children: [
    buildMultiField({
      id: 'postponedIntroMultiField',
      title: messages.postponed.introTitle,
      children: [
        buildDescriptionField({
          id: 'postponedIntroDescription',
          description: messages.postponed.introDescription,
        }),
      ],
    }),
  ],
})
