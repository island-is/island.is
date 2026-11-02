import {
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import { isCapitalIncome } from '../../../utils/conditions'
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
import { buildCanEditRow, buildCanRemoveRow } from '../../../utils/reconcile'
import {
  getCapitalIncomeDefaults,
  toCapitalIncomeRow,
} from '../../../utils/persistedRows'
import {
  isOneTimePayment,
  periodToByFrequency,
  toRequiredNumber,
  toRequiredString,
} from '../../../utils/rowCoercions'

const capitalIncomeValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerCapitalIncome',
  incomeTypeKey: 'capitalIncomePayments',
  persistedPath: 'income.data.capitalIncomePayments',
  toRow: toCapitalIncomeRow,
  callbackId: 'CapitalIncomeValidation',
  messages: {
    fallbackErrorMessage: 'capitalIncomeValidationErrorMessage',
  },
  rowToInput: (row) => ({
    validationId: toRequiredString(row.validationId),
    incomeTypeId: toRequiredString(row.paymentType),
    estimatedIncome: toRequiredNumber(row.amountPerMonth),
    periodFrom: toRequiredString(row.dateFrom),
    periodTo: periodToByFrequency(row),
    oneTimePayment: isOneTimePayment(row),
  }),
}

export const capitalIncomeSection = buildSubSection({
  id: 'capitalIncomeSection',
  title: m.application.capitalIncomeHeading,
  condition: isCapitalIncome,
  children: [
    buildMultiField({
      id: 'capitalIncomeMultiField',
      title: m.application.capitalIncomeHeading,
      description: m.application.capitalIncomeDescription,
      children: [
        ...buildIncomeDescriptionFields('capitalIncomeDescription'),
        buildTableRepeaterField({
          id: 'registerCapitalIncome',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          defaultValue: getCapitalIncomeDefaults,
          canRemoveRow: buildCanRemoveRow(
            capitalIncomeValidationProps.persistedPath,
          ),
          removeButtonDisabledTooltipText: m.application.removeLineNotAllowed,
          editField: true,
          canEditRow: buildCanEditRow(
            capitalIncomeValidationProps.persistedPath,
          ),
          editButtonDisabledTooltipText: m.application.editLineNotAllowed,
          marginTop: 2,
          fields: {
            paymentType: {
              component: 'select',
              label: m.application.paymentType,
              width: 'half',
              required: true,
              options: (application) => {
                const incomeTypes =
                  getValueViaPath<Array<{ id?: string; name?: string }>>(
                    application.externalData,
                    'incomeTypes.data.capitalIncomeTypes',
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
              defaultValue: PaymentFrequency.ONE_TIME,
              clearOnChange: (index: number) => [
                `registerCapitalIncome[${index}].dateTo`,
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
                `registerCapitalIncome[${index}].dateTo`,
              ],
              minDate: getCurrentMonthStartDate,
              maxDate: getMaxRegistrationDate,
            },
            dateTo: {
              component: 'date',
              label: m.application.dateTo,
              width: 'half',
              disabled: (_application, activeField) =>
                activeField?.paymentFrequency === PaymentFrequency.ONE_TIME,
              placeholder: (_application, activeField) =>
                activeField?.paymentFrequency === PaymentFrequency.MONTHLY
                  ? m.application.indefinitePeriod
                  : '',
              maxDate: getMaxRegistrationDate,
              minDate: (_application, activeField) => {
                const fromDate = activeField?.dateFrom
                if (fromDate) {
                  return new Date(fromDate)
                }
                return getCurrentMonthStartDate()
              },
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
              m.application.tableHeaderPaymentType,
              m.application.tableHeaderDateFrom,
              m.application.tableHeaderDateTo,
              m.application.tableHeaderAmount,
            ],
            rows: ['paymentType', 'dateFrom', 'dateTo', 'amountPerMonth'],
            format: {
              paymentType: (value, _displayIndex, application) => {
                if (!value || !application) return ''
                const incomeTypes =
                  getValueViaPath<Array<{ id?: string; name?: string }>>(
                    application.externalData,
                    'incomeTypes.data.capitalIncomeTypes',
                  ) ?? []
                const type = incomeTypes.find((t) => t.id === value)
                return type?.name ?? value
              },
              dateFrom: formatIsDate,
              dateTo: (value, _displayIndex, _application, row) =>
                formatIsDateOrIndefinite(value, row?.paymentFrequency),
              amountPerMonth: formatIsCurrency,
            },
          },
        }),
        buildCustomField(
          {
            id: 'capitalIncomeValidation',
            doesNotRequireAnswer: true,
            component: 'IncomeValidation',
          },
          capitalIncomeValidationProps,
        ),
      ],
    }),
  ],
})
