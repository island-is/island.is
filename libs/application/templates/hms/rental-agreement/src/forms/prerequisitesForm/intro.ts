import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import * as m from '../../lib/messages'

export const intro = buildSection({
  id: 'prerequisitesIntro',
  title: m.prerequisites.intro.subSectionTitle,
  children: [
    buildMultiField({
      id: 'prerequisitesIntroTitle',
      title: m.prerequisites.intro.pageTitle,
      children: [
        buildDescriptionField({
          id: 'prerequisitesIntroText',
          description: m.prerequisites.intro.text,
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'prerequisitesIntroBullets',
          description: m.prerequisites.intro.bullets,
        }),
      ],
    }),
  ],
})
