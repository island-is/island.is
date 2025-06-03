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
} from '@island.is/application/core'
import {
  getPaymentMethodOptions,
  getRentalAmountPaymentDateOptions,
} from '../../../utils/utils'
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
  getIndexDateOptions,
  getIndexRateForDate,
} from '../../../utils/rentalPeriodUtils'
import { rentalAmount } from '../../../lib/messages'

export const RentalPeriodAmount = buildSubSection({
  id: Routes.RENTALAMOUNT,
  title: rentalAmount.subSectionName,
  children: [
    buildMultiField({
      id: Routes.RENTALAMOUNT,
      title: rentalAmount.pageTitle,
      description: rentalAmount.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalAmount.detailsTitle',
          title: rentalAmount.infoTitle,
          titleVariant: 'h3',
          space: 1,
        }),

        // Monthly rental amount and indexation
        buildTextField({
          id: 'rentalAmount.amount',
          title: rentalAmount.inputLabel,
          placeholder: rentalAmount.inputPlaceholder,
          variant: 'currency',
          maxLength: 15,
          required: true,
        }),
        buildCheckboxField({
          id: 'rentalAmount.isIndexConnected',
          clearOnChange: ['rentalAmount.indexTypes'],
          options: [
            {
              value: YesOrNoEnum.YES,
              label: rentalAmount.priceIndexLabel,
            },
          ],
          spacing: 0,
        }),
        buildSelectField({
          id: 'rentalAmount.indexDate',
          title: rentalAmount.indexDateLabel,
          // TODO: Replace hardcoded with dynamic options from index api when available
          options: getIndexDateOptions(),
          condition: rentalAmountConnectedToIndex,
          width: 'half',
        }),
        buildDisplayField({
          id: 'rentalAmount.indexRate',
          label: rentalAmount.indexRateLabel,
          variant: 'text',
          value: (answers) => getIndexRateForDate(answers),
          condition: rentalAmountConnectedToIndex,
          width: 'half',
        }),

        // Payment details
        buildDescriptionField({
          id: 'rentalAmount.paymentDateDetails',
          title: rentalAmount.paymentDateTitle,
          titleVariant: 'h4',
          description: rentalAmount.paymentDateDescription,
          space: 6,
        }),
        buildSelectField({
          id: 'rentalAmount.paymentDateOptions',
          title: rentalAmount.paymentDateOptionsLabel,
          options: getRentalAmountPaymentDateOptions(),
          defaultValue: RentalAmountPaymentDateOptions.FIRST_DAY,
        }),
        buildTextField({
          id: 'rentalAmount.paymentDateOther',
          title: rentalAmount.paymentDateOtherOptionLabel,
          placeholder: rentalAmount.paymentDateOtherOptionPlaceholder,
          maxLength: 100,
          condition: rentalPaymentDateIsOther,
        }),

        // Payment method
        buildDescriptionField({
          id: 'rentalAmount.paymentMethodTitle',
          title: rentalAmount.paymentMethodTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildSelectField({
          id: 'rentalAmount.paymentMethodOptions',
          title: rentalAmount.paymentMethodOptionsLabel,
          options: getPaymentMethodOptions(),
          defaultValue: RentalPaymentMethodOptions.BANK_TRANSFER,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodNationalId',
          title: rentalAmount.paymentMethodNationalIdLabel,
          format: '######-####',
          width: 'half',
          condition: rentalPaymentMethodIsBankTransfer,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodBankAccountNumber',
          title: rentalAmount.paymentMethodBankAccountNumberLabel,
          format: '####-##-######',
          width: 'half',
          condition: rentalPaymentMethodIsBankTransfer,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodOtherTextField',
          title: rentalAmount.paymentMethodOtherTextFieldLabel,
          maxLength: 50,
          condition: rentalPaymentMethodIsOther,
        }),

        // SecurityDeposit
        buildDescriptionField({
          id: 'rentalAmount.securityDepositTitle',
          title: rentalAmount.securityDepositTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'rentalAmount.securityDepositRequired',
          options: [
            {
              value: YesOrNoEnum.YES,
              label: rentalAmount.securityDepositRequiredLabel,
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
