import {
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isPension } from '../../../utils/conditions'
import { PaymentFrequency } from '../../../utils/constants'
import {
  getCurrentMonthEndDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import {
  formatIsCurrency,
  formatIsDateLong,
  formatIsDateLongOrDash,
} from '../../../utils/formatters'

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
            paymentFrequency: {
              component: 'radio',
              largeButtons: false,
              required: true,
              width: 'half',
              clearOnChange: (index: number) => [
                `registerPension[${index}].dateTo`,
              ],
              options: [
                {
                  value: PaymentFrequency.ONE_TIME,
                  label: m.application.oneTimePayment,
                },
                {
                  value: PaymentFrequency.MONTHLY,
                  label: m.application.monthlyPayment,
                },
              ],
            },
            dateFrom: {
              component: 'date',
              label: m.application.dateFrom,
              width: 'half',
              required: true,
              clearOnChange: (index: number) => [
                `registerPension[${index}].dateTo`,
              ],
              minDate: getCurrentMonthStartDate,
              maxDate: getCurrentMonthEndDate,
            },
            dateTo: {
              component: 'date',
              label: m.application.dateTo,
              width: 'half',
              required: (_application, activeField) =>
                activeField?.paymentFrequency === PaymentFrequency.ONE_TIME,
              minDate: (_application, activeField) => {
                const fromDate = activeField?.dateFrom
                if (fromDate) {
                  return new Date(fromDate)
                }
                return getCurrentMonthStartDate()
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
              m.application.tableHeaderDateFrom,
              m.application.tableHeaderDateTo,
              m.application.tableHeaderAmount,
            ],
            rows: [
              'pensionFund',
              'pensionType',
              'dateFrom',
              'dateTo',
              'amountPerMonth',
            ],
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
              dateFrom: formatIsDateLong,
              dateTo: formatIsDateLongOrDash,
              amountPerMonth: formatIsCurrency,
            },
          },
        }),
      ],
    }),
  ],
})
