import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

import * as m from '../../lib/messages'

export const prerequisitesIntro = buildSubSection({
  id: 'prerequisitesIntro',
  title: m.prerequisites.intro.subSectionTitle,
  children: [
    buildMultiField({
      id: 'prerequisitesIntro',
      title: m.prerequisites.intro.pageTitle,
      children: [
        buildCustomField({
          id: 'prerequisitesIntroDetails',
          title: m.prerequisites.intro.pageTitle,
          component: 'GeneralInfoForm',
        }),
      ],
    }),
  ],
})
