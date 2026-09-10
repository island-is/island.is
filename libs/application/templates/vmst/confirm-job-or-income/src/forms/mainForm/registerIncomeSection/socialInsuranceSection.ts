import {
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isSocialInsurance } from '../../../utils/conditions'
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
              width: 'half',
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
              width: 'half',
              currency: true,
              required: true,
              min: 0,
            },
            paymentFrequency: {
              component: 'radio',
              required: true,
              largeButtons: false,
              width: 'half',
              clearOnChange: (index: number) => [
                `registerSocialInsurance[${index}].dateTo`,
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
                `registerSocialInsurance[${index}].dateTo`,
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
          },
          table: {
            header: [
              m.application.tableHeaderPaymentType,
              m.application.tableHeaderDateFrom,
              m.application.tableHeaderDateTo,
              m.application.tableHeaderAmount,
            ],
            rows: ['socialPaymentType', 'dateFrom', 'dateTo', 'amountPerMonth'],
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
