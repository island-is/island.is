import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

import * as m from '../../lib/messages'

const messages = m.prerequisites.intro

export const prerequisitesIntro = buildSubSection({
  id: 'prerequisitesIntro',
  title: messages.subSectionTitle,
  children: [
    buildMultiField({
      id: 'prerequisitesIntro',
      title: messages.pageTitle,
      children: [
        buildCustomField({
          id: 'prerequisitesIntroDetails',
          title: messages.pageTitle,
          component: 'GeneralInfoForm',
        }),
        buildDescriptionField({
          id: 'prerequisitesIntroDescription',
          title: '',
          description: messages.bullets,
        }),
      ],
    }),
  ],
})
