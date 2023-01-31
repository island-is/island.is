import {
  buildForm,
  buildSection,
  buildCustomField,
  buildSubmitField,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { payment, conclusion } from '../../lib/messages'
import { externalDataSection } from './externalDataSection'
import { informationSection } from './InformationSection'

export const ChangeCoOwnerOfVehicleForm: Form = buildForm({
  id: 'ChangeCoOwnerOfVehicleFormDraft',
  title: '',
  mode: FormModes.DRAFT,
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
            buildCustomField({
              id: 'PaymentChargeOverview',
              title: '',
              component: 'PaymentChargeOverview',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: payment.general.confirm,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: payment.general.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'tmp',
      title: conclusion.general.sectionTitle,
      children: [
        // Only to have submit button visible
        buildTextField({
          id: 'tmp',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
