import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildDescriptionField,
  buildCheckboxField,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  AnswerOptions,
  RentalAmountIndexTypes,
  RentalAmountPaymentDateOptions,
  TRUE,
} from '../../lib/constants'
import {
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
} from '../../lib/utils'
import * as m from '../../lib/messages'

const rentalAmountConnectedToIndex = (answers: FormValue) => {
  const isAmountConnectedToIndex = getValueViaPath(
    answers,
    'rentalAmount.isIndexConnected',
    [],
  ) as string[]
  return isAmountConnectedToIndex && isAmountConnectedToIndex.includes(TRUE)
}

export const RentalPeriodAmount = buildSubSection({
  id: 'rentalAmount',
  title: m.rentalAmount.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalAmount.details',
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
        buildSelectField({
          id: 'rentalAmount.indexTypes',
          title: m.rentalAmount.indexOptionsLabel,
          options: getRentalAmountIndexTypes(),
          defaultValue: RentalAmountIndexTypes.CONSUMER_PRICE_INDEX,
          condition: rentalAmountConnectedToIndex,
          width: 'half',
        }),
        buildTextField({
          id: 'rentalAmount.indexValue',
          title: m.rentalAmount.indexValueLabel,
          placeholder: m.rentalAmount.indexValuePlaceholder,
          width: 'half',
          condition: rentalAmountConnectedToIndex,
        }),
        buildCheckboxField({
          id: 'rentalAmount.isIndexConnected',
          title: '',
          options: [
            {
              value: TRUE,
              label: m.rentalAmount.priceIndexLabel,
            },
          ],
          spacing: 0,
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
          condition: (answers) =>
            getValueViaPath(answers, 'rentalAmount.paymentDateOptions') ===
            RentalAmountPaymentDateOptions.OTHER,
        }),
        buildDescriptionField({
          id: 'rentalAmount.paymentInsuranceTitle',
          title: m.rentalAmount.paymentInsuranceTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'rentalAmount.isPaymentInsuranceRequired',
          title: '',
          options: [
            {
              value: AnswerOptions.YES,
              label: m.rentalAmount.paymentInsuranceRequiredLabel,
            },
          ],
        }),
      ],
    }),
  ],
})
