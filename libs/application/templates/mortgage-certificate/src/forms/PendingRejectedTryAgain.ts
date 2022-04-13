import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  DefaultEvents,
  buildSubmitField,
  buildSection,
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const PendingRejectedTryAgain: Form = buildForm({
  id: 'PendingForm',
  title: 'Pending',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'pending',
      title: 'Eign',
      children: [
        buildMultiField({
          id: 'selectRealEstate.info',
          title: m.selectRealEstateTitle,
          space: 1,
          children: [
            buildDescriptionField({
              id: 'PendingRejectedTryAgainDescription',
              title: '',
              description: m.pendingRejectedTryAgainDescription,
            }),
            buildCustomField({
              component: 'PendingRejectedTryAgain',
              id: 'PendingRejectedTryAgain',
              title: '',
              description: '',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.continue,
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
        }),
      ],
    }),
    buildSection({
      id: 'payment',
      title: m.payment,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: m.confirmation,
      children: [],
    }),
  ],
})
