import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../lib/messages'
import { isSocialInsurance } from '../utils/conditions'

export const socialInsuranceFields = [
  buildDescriptionField({
    id: 'socialInsuranceDesc',
    description: m.application.socialInsuranceDescription,
    condition: isSocialInsurance,
  }),
  buildFieldsRepeaterField({
    id: 'registerIncome',
    condition: isSocialInsurance,
    formTitleNumbering: 'none',
    formTitle: (index, application) => {
      const items =
        getValueViaPath<unknown[]>(application.answers, 'registerIncome') ?? []
      return items.length > 1 ? `Tekjur frá Tryggingastofnun ${index + 1}` : ''
    },
    addItemButtonText: m.application.addLine,
    minRows: 1,
    fields: {
      socialPaymentType: {
        component: 'select',
        label: m.application.paymentType,
        required: true,
        options: [
          {
            value: 'disability',
            label: m.application.socialInsuranceDisability,
          },
          {
            value: 'rehabilitation',
            label: m.application.socialInsuranceRehabilitation,
          },
        ],
      },
      amountPerMonth: {
        component: 'input',
        label: m.application.amountPerMonth,
        type: 'number',
        currency: true,
        required: true,
      },
      paymentFrequency: {
        component: 'radio',
        largeButtons: false,
        required: true,
        options: [
          { value: 'oneTime', label: m.application.oneTimePayment },
          { value: 'monthly', label: m.application.monthlyPayment },
        ],
      },
    },
  }),
]
