import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../lib/messages'
import { isPension } from '../utils/conditions'

export const pensionFields = [
  buildDescriptionField({
    id: 'pensionDesc',
    description: m.application.pensionDescription,
    condition: isPension,
  }),
  buildFieldsRepeaterField({
    id: 'registerIncome',
    condition: isPension,
    formTitleNumbering: 'none',
    addItemButtonText: m.application.addLine,
    minRows: 1,
    fields: {
      pensionType: {
        component: 'select',
        label: m.application.paymentType,
        width: 'half',
        required: true,
        options: (application) => {
          const incomeTypes =
            getValueViaPath<Array<{ id?: string; name?: string }>>(
              application.externalData,
              'incomeTypes.data.pensionTypes',
            ) ?? []

          return incomeTypes.map((type) => ({
            label: type.name ?? '',
            value: type.id ?? '',
          }))
        },
      },
      pensionFund: {
        component: 'select',
        label: m.application.pensionFund,
        width: 'half',
        required: true,
        options: (application) => {
          const pensionFunds =
            getValueViaPath<Array<{ id?: string; name?: string }>>(
              application.externalData,
              'pensionFunds.data',
            ) ?? []

          return pensionFunds.map((fund) => ({
            label: fund.name ?? '',
            value: fund.id ?? '',
          }))
        },
      },
      amountPerMonth: {
        component: 'input',
        label: m.application.pensionAmountPerMonth,
        width: 'half',
        type: 'number',
        currency: true,
        required: true,
      },
    },
  }),
]
