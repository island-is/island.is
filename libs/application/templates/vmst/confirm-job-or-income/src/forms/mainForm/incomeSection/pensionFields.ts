import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isPension } from '../../../utils/conditions'

export const pensionFields = [
  buildDescriptionField({
    id: 'pensionDesc',
    description: m.application.pensionDescription,
    condition: isPension,
  }),
  buildFieldsRepeaterField({
    id: 'registerPension',
    condition: isPension,
    formTitleNumbering: 'suffix',
    formTitle: (_index, application) => {
      const items = getValueViaPath<Array<unknown>>(
        application.answers,
        'registerPension',
      )
      if (!items || items.length <= 1) {
        return ''
      }
      return m.application.pensionHeading
    },
    addItemButtonText: m.application.addLine,
    minRows: 1,
    fields: {
      pensionFund: {
        component: 'select',
        label: m.application.pensionFund,
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
      amountPerMonth: {
        component: 'input',
        label: m.application.pensionAmountPerMonth,
        type: 'number',
        width: 'half',
        currency: true,
        required: true,
        min: 0,
      },
    },
  }),
]
