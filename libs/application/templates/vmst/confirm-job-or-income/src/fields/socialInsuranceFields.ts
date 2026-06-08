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
      const items = getValueViaPath<Array<unknown>>(
        application.answers,
        'registerIncome',
      )
      if (!items || items.length <= 1) {
        return ''
      }
      return {
        ...m.application.socialInsuranceHeading,
        values: { index: index + 1 },
      }
    },
    addItemButtonText: m.application.addLine,
    minRows: 1,
    fields: {
      socialPaymentType: {
        component: 'select',
        label: m.application.paymentType,
        required: true,
        options: (application) => {
          const incomeTypes =
            getValueViaPath<Array<{ id?: string; name?: string }>>(
              application.externalData,
              'incomeTypes.data.trTypes',
            ) ?? []

          return incomeTypes.map((type) => ({
            label: type.name ?? '',
            value: type.id ?? '',
          }))
        },
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
        largeButtons: true,
        required: true,
        width: 'half',
        options: [
          { value: 'oneTime', label: m.application.oneTimePayment },
          { value: 'monthly', label: m.application.monthlyPayment },
        ],
      },
    },
  }),
]
