import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { prerequisites } from '../../lib/messages'

const messages = prerequisites.intro

export const intro = buildSection({
  id: 'prerequisitesIntro',
  title: messages.subSectionTitle,
  children: [
    buildMultiField({
      id: 'prerequisitesIntroTitle',
      title: messages.pageTitle,
      children: [
        buildDescriptionField({
          id: 'prerequisitesIntroText',
          description: messages.text,
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'prerequisitesIntroBullets',
          description: messages.bullets,
        }),
      ],
    }),
  ],
})
