import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import * as m from '../../lib/messages'

const messages = m.prerequisites.intro

export const intro = buildSection({
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
        buildSubmitField({
          id: 'toDraft',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Hefja umsókn',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
