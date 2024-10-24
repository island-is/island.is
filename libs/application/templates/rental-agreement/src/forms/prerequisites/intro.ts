import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import * as m from '../../lib/messages'

const messages = m.prerequisites.intro

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
          title: '',
          description: messages.text,
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'prerequisitesIntroBullets',
          title: '',
          description: messages.bullets,
        }),
      ],
    }),
  ],
})
