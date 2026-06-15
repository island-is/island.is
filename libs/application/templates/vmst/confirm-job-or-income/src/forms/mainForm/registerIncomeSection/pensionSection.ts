import {
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isPension } from '../../../utils/conditions'

export const pensionSection = buildSubSection({
  id: 'pensionSection',
  title: m.application.pensionHeading,
  condition: isPension,
  children: [
    buildMultiField({
      id: 'pensionMultiField',
      title: m.application.pensionHeading,
      description: m.application.pensionDescription,
      children: [
        buildTableRepeaterField({
          id: 'registerPension',
          addItemButtonText: m.application.addLine,
          initActiveFieldIfEmpty: true,
          hideTableHeaderIfEmpty: true,
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
          table: {
            header: [
              m.application.tableHeaderPensionFund,
              m.application.tableHeaderPaymentType,
              m.application.tableHeaderAmount,
            ],
            rows: ['pensionFund', 'pensionType', 'amountPerMonth'],
            format: {
              pensionFund: (value, _displayIndex, application) => {
                if (!value || !application) return ''
                const pensionFunds =
                  getValueViaPath<Array<{ id?: string; name?: string }>>(
                    application.externalData,
                    'pensionFunds.data',
                  ) ?? []
                const fund = pensionFunds.find((f) => f.id === value)
                return fund?.name ?? value
              },
              pensionType: (value, _displayIndex, application) => {
                if (!value || !application) return ''
                const incomeTypes =
                  getValueViaPath<Array<{ id?: string; name?: string }>>(
                    application.externalData,
                    'incomeTypes.data.pensionTypes',
                  ) ?? []
                const type = incomeTypes.find((t) => t.id === value)
                return type?.name ?? value
              },
              amountPerMonth: (value) => {
                if (!value) return ''
                const num = Number(value)
                return `${num.toLocaleString('is-IS')} kr.`
              },
            },
          },
        }),
      ],
    }),
  ],
})
