import {
  buildForm,
  buildSection,
  buildCustomField,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messagesx'
import { payment } from '../../lib/messages'
import { externalDataSection } from './externalDataSection'
import { informationSection } from './InformationSection'

export const ChangeOperatorOfVehicleForm: Form = buildForm({
  id: 'ChangeOperatorOfVehicleFormDraft',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    externalDataSection,
    informationSection,
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'paymentMultiField',
          title: payment.general.pageTitle,
          space: 1,
          children: [
            /* buildCustomField({
              id: 'PaymentChargeOverview',
              title: '',
              component: 'PaymentChargeOverview',
            }), */
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.confirm,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationField',
          id: 'ConfirmationField',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
