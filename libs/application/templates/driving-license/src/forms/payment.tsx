import { m } from '../lib/messages'
import {
  buildForm,
  buildSection,
  buildCustomField,
  buildTextField,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: m.paymentCapital,
      children: [
        buildTextField({
          id: 'whatever',
          title: 'HEY',
          description:
            'Ekki gleyma að breyta þessum kóða þar sem payment hefur verið tekið út í tilraunaskyni eða whatever!',
        }),
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'footer',
          actions: [
            {
              event: 'SUBMIT',
              name: {
                id: 'DingoBingo',
                defaultMessage: 'SUBMIT BABY',
              },
              type: 'primary',
            },
          ],
        }),
        //buildCustomField({
        //  component: 'PaymentPending',
        //  id: 'paymentPendingField',
        //  title: '',
        //}),
      ],
    }),
  ],
})
