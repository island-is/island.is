import {
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
  buildDescriptionField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { GaldurExternalDomainModelsIncomeTRPaymentDTO } from '@island.is/clients/vmst-unemployment'
import { uuid } from 'uuidv4'
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
import { IncomeValidationFieldProps } from '../../../fields/IncomeValidation'
import {
  periodToByFrequency,
  toRequiredNumber,
  toRequiredString,
} from '../../../utils/rowCoercions'

const getSocialInsuranceDefaults = (application: Application) => {
  const payments =
    getValueViaPath<GaldurExternalDomainModelsIncomeTRPaymentDTO[]>(
      application.externalData,
      'income.data.trPayments',
    ) ?? []

  return payments.map((payment) => ({
    validationId: payment.id,
    socialPaymentType: payment.incomeTypeId ?? '',
    amountPerMonth:
      payment.estimatedIncome != null ? String(payment.estimatedIncome) : '',
    dateFrom: payment.periodFrom ?? '',
    dateTo: payment.periodTo ?? '',
  }))
}

const socialInsuranceValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerSocialInsurance',
  incomeTypeKey: 'trPayments',
  persistedPath: 'income.data.trPayments',
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
        buildDescriptionField({
          title: () => {
            const month = new Date().toLocaleDateString('is-IS', {
              month: 'long',
            })
            return {
              ...m.application.incomeTitle,
              values: { month },
            }
          },
          description: m.application.incomeDescriptionLink,
          titleVariant: 'h4',
          id: 'socialInsuranceDescription',
        }),
        buildTableRepeaterField({
          id: 'registerSocialInsurance',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          defaultValue: getSocialInsuranceDefaults,
          marginTop: 2,
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
            // Correlates each row with the 3rd party validation response.
            // Reuses an existing id if already present (persisted row or previously validated)
            // so this function stays idempotent across renders.
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
