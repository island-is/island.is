import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  buildDateField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  getApplicationAnswers,
  getRentalOtherFeesPayeeOptions,
} from '../../lib/utils'
import { RentOtherFeesPayeeOptions } from '../../lib/constants'
import { otherFees } from '../../lib/messages'

const housingFundAmountPayedByTenant = (answers: FormValue) => {
  const { rentOtherFeesHousingFund } = getApplicationAnswers(answers)
  return rentOtherFeesHousingFund === RentOtherFeesPayeeOptions.TENANT
}

const electricityCostPayedByTenant = (answers: FormValue) => {
  const { rentOtherFeesElectricityCost } = getApplicationAnswers(answers)
  return rentOtherFeesElectricityCost === RentOtherFeesPayeeOptions.TENANT
}

const heatingCostPayedByTenant = (answers: FormValue) => {
  const { rentOtherFeesHeatingCost } = getApplicationAnswers(answers)
  return rentOtherFeesHeatingCost === RentOtherFeesPayeeOptions.TENANT
}

export const RentalPeriodOtherFees = buildSubSection({
  id: 'rentOtherFees',
  title: otherFees.subSectionName,
  children: [
    buildMultiField({
      id: 'rentOtherFees.details',
      title: otherFees.pageTitle,
      description: otherFees.pageDescription,
      children: [
        buildRadioField({
          id: 'rentOtherFees.housingFund',
          title: otherFees.housingFundTitle,
          options: getRentalOtherFeesPayeeOptions,
          width: 'half',
          space: 1,
        }),
        buildTextField({
          id: 'rentOtherFees.housingFundAmount',
          title: otherFees.housingFundAmountLabel,
          placeholder: otherFees.housingFundAmountPlaceholder,
          variant: 'currency',
          maxLength: 13,
          condition: housingFundAmountPayedByTenant,
        }),

        // Electricity cost fields
        buildRadioField({
          id: 'rentOtherFees.electricityCost',
          title: otherFees.electricityCostTitle,
          options: getRentalOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'rentOtherFees.electricityCostMeterNumber',
          title: otherFees.electricityCostMeterNumberLabel,
          placeholder: otherFees.electricityCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: electricityCostPayedByTenant,
        }),
        buildTextField({
          id: 'rentOtherFees.electricityCostMeterStatus',
          title: otherFees.electricityCostMeterStatusLabel,
          placeholder: otherFees.electricityCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: electricityCostPayedByTenant,
        }),
        buildDateField({
          id: 'rentOtherFees.electricityCostMeterStatusDate',
          title: otherFees.electricityCostMeterStatusDateLabel,
          placeholder: otherFees.electricityCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: electricityCostPayedByTenant,
        }),

        // Heating cost fields
        buildRadioField({
          id: 'rentOtherFees.heatingCost',
          title: otherFees.heatingCostTitle,
          options: getRentalOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'rentOtherFees.heatingCostMeterNumber',
          title: otherFees.heatingCostMeterNumberLabel,
          placeholder: otherFees.heatingCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: heatingCostPayedByTenant,
        }),
        buildTextField({
          id: 'rentOtherFees.heatingCostMeterStatus',
          title: otherFees.heatingCostMeterStatusLabel,
          placeholder: otherFees.heatingCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: heatingCostPayedByTenant,
        }),
        buildDateField({
          id: 'rentOtherFees.heatingCostMeterStatusDate',
          title: otherFees.heatingCostMeterStatusDateLabel,
          placeholder: otherFees.heatingCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: heatingCostPayedByTenant,
        }),

        // TODO: Add otherCosts fields when ready
        // Other fees
        // buildDescriptionField({
        //   id: 'rentOtherFees.otherCostsTitle',
        //   title: otherFees.otherCostsTitle,
        //   titleVariant: 'h4',
        //   space: 6,
        // }),
        // buildCheckboxField({
        //   id: 'rentOtherFees.otherCosts',
        //   title: '',
        //   options: [
        //     {
        //       value: TRUE,
        //       label: otherFees.otherCostsLabel,
        //     },
        //   ],
        //   spacing: 0,
        // }),
        // buildTextField({
        //   id: 'rentOtherFees.otherCostsDescription',
        //   title: otherFees.otherCostsDescriptionLabel,
        //   placeholder: otherFees.otherCostsDescriptionPlaceholder,
        //   width: 'half',
        //   condition: (answers) => {
        //     const rentOtherFeesOtherCosts = getValueViaPath(
        //       answers,
        //       'rentOtherFees.otherCosts',
        //       [],
        //     ) as string[]
        //     return (
        //       rentOtherFeesOtherCosts && rentOtherFeesOtherCosts.includes(TRUE)
        //     )
        //   },
        // }),
        // buildTextField({
        //   id: 'rentOtherFees.otherCostsAmount',
        //   title: otherFees.otherCostsAmountLabel,
        //   placeholder: otherFees.otherCostsAmountPlaceholder,
        //   width: 'half',
        //   condition: (answers) => {
        //     const rentOtherFeesOtherCosts = getValueViaPath(
        //       answers,
        //       'rentOtherFees.otherCosts',
        //       [],
        //     ) as string[]
        //     return (
        //       rentOtherFeesOtherCosts && rentOtherFeesOtherCosts.includes(TRUE)
        //     )
        //   },
        // }),
      ],
    }),
  ],
})
