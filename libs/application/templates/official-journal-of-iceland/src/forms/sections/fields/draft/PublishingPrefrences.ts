// Óskir um birtingu

import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, MultiField } from '@island.is/application/types'
import { m } from '../../../../lib/messages'
export const PublishingPreferencesField: MultiField = buildMultiField({
  id: 'PublishingPreferencesField',
  title: '',
  children: [
    buildCustomField({
      id: 'PublishingPrefrences',
      title: '',
      component: 'PublishingPrefrences',
    }),
    buildSubmitField({
      id: 'submit',
      title: m.continue,
      placement: 'footer',
      refetchApplicationAfterSubmit: true,
      actions: [
        {
          event: DefaultEvents.SUBMIT,
          name: m.continue,
          type: 'primary',
        },
      ],
    }),
  ],
})
