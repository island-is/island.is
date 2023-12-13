// Viðaukar og fylgiskjöl

import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, MultiField } from '@island.is/application/types'
import { m } from '../../../../lib/messages'
export const AdditionsAndDocumentsField: MultiField = buildMultiField({
  id: 'additionsAndDocuments',
  title: '',
  children: [
    buildCustomField({
      id: 'additionsAndDocuments',
      title: '',
      component: 'AdditionsAndDocuments',
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
