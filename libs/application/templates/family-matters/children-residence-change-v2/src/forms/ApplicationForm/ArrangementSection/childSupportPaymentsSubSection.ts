import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { Answers } from '../../../types'
import * as m from '../../../lib/messages'

export const childSupportPaymentsSubSection = buildSubSection({
  id: 'childSupportPayments',
  title: m.childSupportPayments.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'childSupportPaymentsMultiField',
      title: m.childSupportPayments.general.sectionTitle,
      description: m.childSupportPayments.general.description,
      children: [
        buildRadioField({
          id: 'selectChildSupportPayment',
          title: '',
          backgroundColor: 'white',
          required: true,
          options: [
            {
              label: m.childSupportPayments.radioAgreement.title,
              value: 'agreement',
              subLabel: m.childSupportPayments.radioAgreement.description,
            },
            {
              label: m.childSupportPayments.radioChildSupport.title,
              value: 'childSupport',
              subLabel: m.childSupportPayments.radioChildSupport.description,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'alert',
          title: '',
          message: m.childSupportPayments.general.alert,
          alertType: 'info',
          condition: (values) =>
            (values as unknown as Answers).selectChildSupportPayment ===
            'agreement',
        }),
        buildDescriptionField({
          id: 'infoText',
          title: '',
          space: 2,
          description: m.childSupportPayments.general.infoText,
        }),
      ],
    }),
  ],
})
