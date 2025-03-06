import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildDescriptionField,
  buildCheckboxField,
  buildSelectField,
  getValueViaPath,
  buildHiddenInput,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  AnswerOptions,
  RentalAmountIndexTypes,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
  Routes,
  TRUE,
} from '../../../lib/constants'
import {
  getPaymentMethodOptions,
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
} from '../../../lib/utils'
import { rentalAmount } from '../../../lib/messages'

const rentalAmountConnectedToIndex = (answers: FormValue) => {
  const isAmountConnectedToIndex = getValueViaPath(
    answers,
    'rentalAmount.isIndexConnected',
    [],
  ) as string[]
  return isAmountConnectedToIndex && isAmountConnectedToIndex.includes(TRUE)
}

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
        buildSelectField({
          id: 'rentalAmount.indexTypes',
          title: rentalAmount.indexOptionsLabel,
          options: getRentalAmountIndexTypes(),
          defaultValue: RentalAmountIndexTypes.CONSUMER_PRICE_INDEX,
          condition: rentalAmountConnectedToIndex,
        }),
        buildCheckboxField({
          id: 'rentalAmount.isIndexConnected',
          title: '',
          clearOnChange: ['rentalAmount.indexTypes'],
          options: [
            {
              value: TRUE,
              label: rentalAmount.priceIndexLabel,
            },
          ],
          spacing: 0,
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
          condition: (answers) =>
            getValueViaPath(answers, 'rentalAmount.paymentDateOptions') ===
            RentalAmountPaymentDateOptions.OTHER,
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
          condition: (answers) =>
            getValueViaPath(answers, 'rentalAmount.paymentMethodOptions') ===
            RentalPaymentMethodOptions.BANK_TRANSFER,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodBankAccountNumber',
          title: rentalAmount.paymentMethodBankAccountNumberLabel,
          format: '####-##-######',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'rentalAmount.paymentMethodOptions') ===
            RentalPaymentMethodOptions.BANK_TRANSFER,
        }),
        buildTextField({
          id: 'rentalAmount.paymentMethodOtherTextField',
          title: rentalAmount.paymentMethodOtherTextFieldLabel,
          maxLength: 50,
          condition: (answers) =>
            getValueViaPath(answers, 'rentalAmount.paymentMethodOptions') ===
            RentalPaymentMethodOptions.OTHER,
        }),

        // Payment insurance
        buildDescriptionField({
          id: 'rentalAmount.paymentInsuranceTitle',
          title: rentalAmount.paymentInsuranceTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'rentalAmount.isPaymentInsuranceRequired',
          title: '',
          options: [
            {
              value: AnswerOptions.YES,
              label: rentalAmount.paymentInsuranceRequiredLabel,
            },
          ],
        }),
        buildHiddenInput({
          id: 'rentalAmount.paymentInsuranceDetails',
          condition: (answers) => {
            const checkbox = getValueViaPath<Array<string>>(
              answers,
              'rentalAmount.isPaymentInsuranceRequired',
            )
            return checkbox?.includes(AnswerOptions.YES) || false
          },
        }),
      ],
    }),
  ],
})
