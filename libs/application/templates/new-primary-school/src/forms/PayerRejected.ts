import {
  buildAlertMessageField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents, Form } from '@island.is/application/types'
import {
  newPrimarySchoolMessages,
  payerRejectedMessages,
} from '../lib/messages'
import { getApplicationAnswers } from '../utils/newPrimarySchoolUtils'

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
          title: payerRejectedMessages.title,
          description: payerRejectedMessages.description,
          children: [
            buildTextField({
              id: 'payerRejected.payerName',
              title: payerRejectedMessages.payerName,
              width: 'full',
              disabled: true,
              defaultValue: (application: Application) => {
                const { payerName } = getApplicationAnswers(application.answers)
                return payerName
              },
            }),
            buildTextField({
              id: 'payerRejected.payerNationalId',
              title: newPrimarySchoolMessages.shared.nationalId,
              width: 'full',
              format: '######-####',
              disabled: true,
              defaultValue: (application: Application) => {
                const { payerNationalId } = getApplicationAnswers(
                  application.answers,
                )
                return payerNationalId
              },
            }),
            buildAlertMessageField({
              id: 'payerRejected.alertMessage',
              title: newPrimarySchoolMessages.shared.alertTitle,
              message: payerRejectedMessages.alertMessage,
              doesNotRequireAnswer: true,
              alertType: 'info',
              marginTop: 4,
            }),
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
