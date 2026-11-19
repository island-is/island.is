import {
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import { isPension } from '../../../utils/conditions'
import { PaymentFrequency } from '../../../utils/constants'
import {
  getMaxRegistrationDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import {
  formatIsCurrency,
  formatIsDate,
  formatIsDateOrIndefinite,
} from '../../../utils/formatters'
import { IncomeValidationFieldProps } from '../../../fields/IncomeValidation'
import { buildIncomeDescriptionFields } from './incomeDescriptionFields'
import { buildPersistedRowProps } from '../../../utils/reconcile'
import { getPensionDefaults, toPensionRow } from '../../../utils/persistedRows'
import {
  isOneTimePayment,
  periodToByFrequency,
  toOptionalString,
  toRequiredNumber,
  toRequiredString,
} from '../../../utils/rowCoercions'

const pensionValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerPension',
  incomeTypeKey: 'pensionPayments',
  persistedPath: 'income.data.pensionPayments',
  toRow: toPensionRow,
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
    oneTimePayment: isOneTimePayment(row),
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
        ...buildIncomeDescriptionFields('pensionDescription'),
        buildTableRepeaterField({
          id: 'registerPension',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          defaultValue: getPensionDefaults,
          removeButtonDisabledTooltipText: m.application.removeLineNotAllowed,
          editField: true,
          editButtonDisabledTooltipText: m.application.editLineNotAllowed,
          marginTop: 2,
          fields: {
            pensionType: {
              component: 'select',
              label: m.application.paymentType,
              width: 'half',
              required: true,
              options: ({ application }) => {
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
              options: ({ application }) => {
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
              defaultValue: PaymentFrequency.ONE_TIME,
              clearOnChange: ({ index }) => [
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
              clearOnChange: ({ index }) => [
                `registerPension[${index}].dateTo`,
              ],
              minDate: () => getCurrentMonthStartDate(),
              maxDate: () => getMaxRegistrationDate(),
            },
            dateTo: {
              component: 'date',
              label: m.application.dateTo,
              width: 'half',
              disabled: ({ row: activeField }) =>
                activeField?.paymentFrequency === PaymentFrequency.ONE_TIME,
              placeholder: ({ row: activeField }) =>
                activeField?.paymentFrequency === PaymentFrequency.MONTHLY
                  ? m.application.indefinitePeriod
                  : '',
              maxDate: () => getMaxRegistrationDate(),
              minDate: ({ row: activeField }) => {
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
              defaultValue: ({ row: activeField }) =>
                activeField?.validationId ?? uuid(),
            },
          },
          table: {
            columns: [
              {
                header: m.application.tableHeaderPensionFund,
                value: ({ row, application }) => {
                  const value = row.pensionFund ?? ''
                  if (!value || !application) return ''
                  const pensionFunds =
                    getValueViaPath<Array<{ id?: string; name?: string }>>(
                      application.externalData,
                      'pensionFunds.data',
                    ) ?? []
                  const fund = pensionFunds.find((f) => f.id === value)
                  return fund?.name ?? value
                },
              },
              {
                header: m.application.tableHeaderPaymentType,
                value: ({ row, application }) => {
                  const value = row.pensionType ?? ''
                  if (!value || !application) return ''
                  const incomeTypes =
                    getValueViaPath<Array<{ id?: string; name?: string }>>(
                      application.externalData,
                      'incomeTypes.data.pensionTypes',
                    ) ?? []
                  const type = incomeTypes.find((t) => t.id === value)
                  return type?.name ?? value
                },
              },
              {
                header: m.application.tableHeaderDateFrom,
                value: ({ row }) => formatIsDate(row.dateFrom ?? ''),
              },
              {
                header: m.application.tableHeaderDateTo,
                value: ({ row }) => {
                  const value = row.dateTo ?? ''
                  return formatIsDateOrIndefinite(value, row?.paymentFrequency)
                },
              },
              {
                header: m.application.tableHeaderAmount,
                value: ({ row }) => formatIsCurrency(row.amountPerMonth ?? ''),
              },
            ],
            rowProps: buildPersistedRowProps(
              pensionValidationProps.persistedPath,
            ),
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
