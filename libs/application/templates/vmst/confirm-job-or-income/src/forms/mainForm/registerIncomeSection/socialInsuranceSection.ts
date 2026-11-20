import {
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import { isSocialInsurance } from '../../../utils/conditions'
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
import {
  getSocialInsuranceDefaults,
  toSocialInsuranceRow,
} from '../../../utils/persistedRows'
import {
  isOneTimePayment,
  periodToByFrequency,
  toRequiredNumber,
  toRequiredString,
} from '../../../utils/rowCoercions'

const socialInsuranceValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerSocialInsurance',
  incomeTypeKey: 'trPayments',
  persistedPath: 'income.data.trPayments',
  toRow: toSocialInsuranceRow,
  callbackId: 'SocialInsuranceValidation',
  messages: {
    fallbackErrorMessage: 'socialInsuranceValidationErrorMessage',
  },
  rowToInput: (row) => ({
    validationId: toRequiredString(row.validationId),
    incomeTypeId: toRequiredString(row.socialPaymentType),
    estimatedIncome: toRequiredNumber(row.amountPerMonth),
    periodFrom: toRequiredString(row.dateFrom),
    periodTo: periodToByFrequency(row),
    oneTimePayment: isOneTimePayment(row),
  }),
}

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
        ...buildIncomeDescriptionFields('socialInsuranceDescription'),
        buildTableRepeaterField({
          id: 'registerSocialInsurance',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          defaultValue: getSocialInsuranceDefaults,
          removeButtonDisabledTooltipText: m.application.removeLineNotAllowed,
          editField: true,
          editButtonDisabledTooltipText: m.application.editLineNotAllowed,
          marginTop: 2,
          fields: {
            socialPaymentType: {
              component: 'select',
              label: m.application.paymentType,
              width: 'half',
              required: true,
              options: ({ application }) => {
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
              defaultValue: PaymentFrequency.ONE_TIME,
              clearOnChange: ({ index }) => [
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
              clearOnChange: ({ index }) => [
                `registerSocialInsurance[${index}].dateTo`,
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
            // Correlates each row with the 3rd party validation response.
            // Reuses an existing id if already present (persisted row or previously validated)
            // so this function stays idempotent across renders.
            validationId: {
              component: 'hiddenInput',
              defaultValue: ({ row: activeField }) =>
                activeField?.validationId ?? uuid(),
            },
          },
          table: {
            columns: [
              {
                header: m.application.tableHeaderPaymentType,
                value: ({ row, application }) => {
                  const value = row.socialPaymentType ?? ''
                  if (!value || !application) return ''
                  const incomeTypes =
                    getValueViaPath<Array<{ id?: string; name?: string }>>(
                      application.externalData,
                      'incomeTypes.data.trTypes',
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
              socialInsuranceValidationProps.persistedPath,
            ),
          },
        }),
        buildCustomField(
          {
            id: 'socialInsuranceValidation',
            doesNotRequireAnswer: true,
            component: 'IncomeValidation',
          },
          socialInsuranceValidationProps,
        ),
      ],
    }),
  ],
})
