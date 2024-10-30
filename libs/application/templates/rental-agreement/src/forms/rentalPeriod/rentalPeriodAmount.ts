import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildDescriptionField,
  buildCheckboxField,
  buildSelectField,
  buildDateField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  AnswerOptions,
  rentalAmountIndexTypes,
  rentalAmountPaymentDateOptions,
} from '../../lib/constants'
import {
  getApplicationAnswers,
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
} from '../../lib/utils'
import * as m from '../../lib/messages'

function rentalAmountIndexIsConnected(answers: FormValue) {
  const { isRentalAmountIndexConnected } = getApplicationAnswers(answers)
  return isRentalAmountIndexConnected !== undefined
}

export const RentalPeriodAmount = buildSubSection({
  id: 'rentalAmount',
  title: m.rentalAmount.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalAmountDetails',
      title: m.rentalAmount.pageTitle,
      description: m.rentalAmount.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalAmountDetailsTitle',
          title: m.rentalAmount.infoTitle,
          titleVariant: 'h3',
          space: 1,
        }),

        // Monthly rental amount and indexation
        buildTextField({
          id: 'rentalAmountInput',
          title: m.rentalAmount.inputLabel,
          placeholder: m.rentalAmount.inputPlaceholder,
          variant: 'currency',
          maxLength: 15,
        }),
        buildSelectField({
          id: 'rentalAmountIndexTypes',
          title: m.rentalAmount.indexOptionsLabel,
          options: getRentalAmountIndexTypes(),
          defaultValue: rentalAmountIndexTypes.CONSUMER_PRICE_INDEX,
          condition: rentalAmountIndexIsConnected,
          width: 'half',
        }),
        buildTextField({
          id: 'rentalAmountIndexValue',
          title: m.rentalAmount.indexValueLabel,
          placeholder: m.rentalAmount.indexValuePlaceholder,
          variant: 'number',
          width: 'half',
          condition: rentalAmountIndexIsConnected,
        }),
        buildCheckboxField({
          id: 'isRentalAmountIndexConnected',
          title: '',
          options: [
            {
              value: AnswerOptions.YES,
              label: m.rentalAmount.priceIndexLabel,
            },
          ],
          spacing: 0,
        }),

        // Payment details
        buildDescriptionField({
          id: 'rentalAmountPaymentDateDetails',
          title: m.rentalAmount.paymentDateTitle,
          titleVariant: 'h4',
          description: m.rentalAmount.paymentDateDescription,
          space: 6,
        }),
        buildSelectField({
          id: 'rentalAmountPaymentDateOptions',
          title: m.rentalAmount.paymentDateOptionsLabel,
          options: getRentalAmountPaymentDateOptions(),
          defaultValue: rentalAmountPaymentDateOptions.FIRST_DAY,
        }),
        buildTextField({
          id: 'rentalAmountPaymentDateOther',
          title: m.rentalAmount.paymentDateOtherOptionLabel,
          placeholder: m.rentalAmount.paymentDateOtherOptionPlaceholder,
          condition: (answers) =>
            getValueViaPath(answers, 'rentalAmountPaymentDateOptions') ===
            rentalAmountPaymentDateOptions.OTHER,
        }),
        buildDescriptionField({
          id: 'rentalAmountPaymentInsuranceTitle',
          title: m.rentalAmount.paymentInsuranceTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'isRentalAmountPaymentInsuranceRequired',
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
