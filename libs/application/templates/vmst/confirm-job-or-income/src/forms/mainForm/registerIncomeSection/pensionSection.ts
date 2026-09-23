import {
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { GaldurExternalDomainModelsIncomePensionPaymentDTO } from '@island.is/clients/vmst-unemployment'
import { uuid } from 'uuidv4'
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
import { IncomeValidationFieldProps } from '../../../fields/IncomeValidation'
import {
  periodToByFrequency,
  toOptionalString,
  toRequiredNumber,
  toRequiredString,
} from '../../../utils/rowCoercions'

const getPensionDefaults = (application: Application) => {
  const payments =
    getValueViaPath<GaldurExternalDomainModelsIncomePensionPaymentDTO[]>(
      application.externalData,
      'income.data.pensionPayments',
    ) ?? []

  return payments.map((payment) => ({
    validationId: payment.id,
    pensionType: payment.incomeTypeId ?? '',
    pensionFund: payment.pensionFundId ?? '',
    amountPerMonth:
      payment.estimatedIncome != null ? String(payment.estimatedIncome) : '',
    dateFrom: payment.periodFrom ?? '',
    dateTo: payment.periodTo ?? '',
  }))
}

const pensionValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerPension',
  incomeTypeKey: 'pensionPayments',
  persistedPath: 'income.data.pensionPayments',
  callbackId: 'PensionValidation',
  messages: {
    fallbackErrorMessage: 'pensionValidationErrorMessage',
  },
  rowToInput: (row) => ({
    validationId: toRequiredString(row.validationId),
    incomeTypeId: toRequiredString(row.pensionType),
    pensionFundId: toOptionalString(row.pensionFund),
    estimatedIncome: toRequiredNumber(row.amountPerMonth),
    periodFrom: toRequiredString(row.dateFrom),
    periodTo: periodToByFrequency(row),
  }),
}

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
          hideTableHeaderIfEmpty: true,
          defaultValue: getPensionDefaults,
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
            // Correlates each row with the 3rd party validation response.
            // Reuses an existing id (persisted or previously minted) so this
            // function stays idempotent across renders.
            validationId: {
              component: 'hiddenInput',
              defaultValue: (
                _application: Application,
                activeField?: Record<string, string>,
              ) => activeField?.validationId ?? uuid(),
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
        buildCustomField(
          {
            id: 'pensionValidation',
            doesNotRequireAnswer: true,
            component: 'IncomeValidation',
          },
          pensionValidationProps,
        ),
      ],
    }),
  ],
})
