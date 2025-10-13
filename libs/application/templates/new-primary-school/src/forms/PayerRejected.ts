import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form } from '@island.is/application/types'
import { payerRejectedMessages } from '../lib/messages'

export const PayerRejected: Form = buildForm({
  id: 'newPrimarySchoolPayerRejected',
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'payerRejected',
      tabTitle: payerRejectedMessages.tabTitle,
      children: [
        buildMultiField({
          id: 'payerRejected',
          title: payerRejectedMessages.formTitle,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: payerRejectedMessages.edit,
                  type: 'sign',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
