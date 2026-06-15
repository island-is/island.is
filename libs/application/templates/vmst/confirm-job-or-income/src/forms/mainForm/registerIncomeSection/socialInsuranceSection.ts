import {
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isSocialInsurance } from '../../../utils/conditions'

export const socialInsuranceSection = buildSubSection({
  id: 'socialInsuranceSection',
  title: m.application.socialInsuranceHeading,
  condition: isSocialInsurance,
  children: [
    buildMultiField({
      id: 'socialInsuranceMultiField',
      title: m.application.socialInsuranceHeading,
      description: m.application.socialInsuranceDescription,
      children: [
        buildTableRepeaterField({
          id: 'registerSocialInsurance',
          addItemButtonText: m.application.addLine,
          initActiveFieldIfEmpty: true,
          hideTableHeaderIfEmpty: true,
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
              min: 0,
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
          table: {
            header: [
              m.application.tableHeaderPaymentType,
              m.application.tableHeaderAmount,
              m.application.tableHeaderFrequency,
            ],
            rows: ['socialPaymentType', 'amountPerMonth', 'paymentFrequency'],
            format: {
              socialPaymentType: (value, _displayIndex, application) => {
                if (!value || !application) return ''
                const incomeTypes =
                  getValueViaPath<Array<{ id?: string; name?: string }>>(
                    application.externalData,
                    'incomeTypes.data.trTypes',
                  ) ?? []
                const type = incomeTypes.find((t) => t.id === value)
                return type?.name ?? value
              },
              amountPerMonth: (value) => {
                if (!value) return ''
                const num = Number(value)
                return `${num.toLocaleString('is-IS')} kr.`
              },
              paymentFrequency: (value) => {
                if (!value) return ''
                return value === 'oneTime'
                  ? m.application.oneTimePayment
                  : m.application.monthlyPayment
              },
            },
          },
        }),
      ],
    }),
  ],
})
