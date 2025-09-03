import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildDescriptionField,
  buildCheckboxField,
  buildSelectField,
  buildHiddenInput,
  YesOrNoEnum,
  buildDisplayField,
  buildHiddenInputWithWatchedValue,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  Routes,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
} from '../../../utils/enums'
import {
  rentalAmountConnectedToIndex,
  rentalInsuranceRequired,
  rentalPaymentDateIsOther,
  rentalPaymentMethodIsBankTransfer,
  rentalPaymentMethodIsOther,
  getConsumerIndexDateOptions,
  getIndexRateForConsumerIndexDate,
} from '../../../utils/rentalPeriodUtils'
import * as m from '../../../lib/messages'
import {
  getPaymentMethodOptions,
  getRentalAmountPaymentDateOptions,
} from '../../../utils/options'

export const RentalPeriodAmount = buildSubSection({
  id: Routes.RENTALAMOUNT,
  title: m.rentalAmount.subSectionName,
  children: [
    buildMultiField({
      id: Routes.RENTALAMOUNT,
      title: m.rentalAmount.pageTitle,
      description: m.rentalAmount.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalAmount.detailsTitle',
          title: m.rentalAmount.infoTitle,
          titleVariant: 'h3',
          space: 1,
        }),

        // Monthly rental amount and indexation
        buildTextField({
          id: 'rentalAmount.amount',
          title: m.rentalAmount.inputLabel,
          placeholder: m.rentalAmount.inputPlaceholder,
          variant: 'currency',
          maxLength: 15,
          required: true,
        }),

        // Hidden fields  to capture rental period start and end dates
        buildHiddenInputWithWatchedValue({
          id: 'rentalAmount.rentalPeriodStartDate',
          watchValue: 'rentalPeriod.startDate',
        }),
        buildHiddenInputWithWatchedValue({
          id: 'rentalAmount.rentalPeriodEndDate',
          watchValue: 'rentalPeriod.endDate',
        }),
        buildHiddenInputWithWatchedValue({
          id: 'rentalAmount.rentalPeriodIsDefinite',
          watchValue: 'rentalPeriod.isDefinite',
        }),

        buildCheckboxField({
          id: 'rentalAmount.isIndexConnected',
          options: [
            {
              value: YesOrNoEnum.YES,
              label: m.rentalAmount.priceIndexLabel,
            },
          ],
          spacing: 0,
          marginTop: 1,
        }),
        buildSelectField({
          id: 'rentalAmount.indexDate',
          title: m.rentalAmount.indexDateLabel,
          options: (application: Application) => {
            return getConsumerIndexDateOptions(application)
          },
          defaultValue: (application: Application) => {
            const options = getConsumerIndexDateOptions(application)
            return options.length > 0 ? options[0].value : undefined
          },
          condition: rentalAmountConnectedToIndex,
          width: 'half',
          marginTop: 1,
        }),
        buildDisplayField({
          id: 'rentalAmount.indexRate',
          label: m.rentalAmount.indexRateLabel,
          variant: 'text',
          value: (answers, externalData) => {
            const rate = getIndexRateForConsumerIndexDate(answers, externalData)
            return rate !== undefined ? rate.replace('.', ',') : ''
          },
          condition: rentalAmountConnectedToIndex,
          width: 'half',
        }),

        // Payment details
        buildDescriptionField({
          id: 'rentalAmount.paymentDateDetails',
          title: m.rentalAmount.paymentDateTitle,
          titleVariant: 'h4',
          description: m.rentalAmount.paymentDateDescription,
          space: 6,
        }),
        buildSelectField({
          id: 'rentalAmount.paymentDateOptions',
          title: m.rentalAmount.paymentDateOptionsLabel,
          options: getRentalAmountPaymentDateOptions(),
          defaultValue: RentalAmountPaymentDateOptions.FIRST_DAY,
        }),
        buildTextField({
          id: 'rentalAmount.paymentDateOther',
          title: m.rentalAmount.paymentDateOtherOptionLabel,
          placeholder: m.rentalAmount.paymentDateOtherOptionPlaceholder,
          maxLength: 100,
          condition: rentalPaymentDateIsOther,
        }),

        // Payment method
        buildDescriptionField({
          id: 'rentalAmount.paymentMethodTitle',
          title: m.rentalAmount.paymentMethodTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildSelectField({
          id: 'rentalAmount.paymentMethodOptions',
          title: m.rentalAmount.paymentMethodOptionsLabel,
          options: getPaymentMethodOptions(),
          defaultValue: RentalPaymentMethodOptions.BANK_TRANSFER,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodNationalId',
          title: m.rentalAmount.paymentMethodNationalIdLabel,
          format: '######-####',
          width: 'half',
          condition: rentalPaymentMethodIsBankTransfer,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodBankAccountNumber',
          title: m.rentalAmount.paymentMethodBankAccountNumberLabel,
          format: '####-##-######',
          width: 'half',
          condition: rentalPaymentMethodIsBankTransfer,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodOtherTextField',
          title: m.rentalAmount.paymentMethodOtherTextFieldLabel,
          maxLength: 50,
          condition: rentalPaymentMethodIsOther,
        }),

        // SecurityDeposit
        buildDescriptionField({
          id: 'rentalAmount.securityDepositTitle',
          title: m.rentalAmount.securityDepositTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'rentalAmount.securityDepositRequired',
          options: [
            {
              value: YesOrNoEnum.YES,
              label: m.rentalAmount.securityDepositRequiredLabel,
            },
          ],
        }),
        buildHiddenInput({
          // Hidden field to capture payment insurance details when insurance is required.
          // Its value is populated by the insurance-details component at runtime.
          id: 'rentalAmount.securityDepositDetails',
          condition: rentalInsuranceRequired,
        }),
      ],
    }),
  ],
})
