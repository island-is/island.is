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
import * as m from '../../lib/messages'

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
  title: m.otherFees.subSectionName,
  children: [
    buildMultiField({
      id: 'rentOtherFees.details',
      title: m.otherFees.pageTitle,
      description: m.otherFees.pageDescription,
      children: [
        buildRadioField({
          id: 'rentOtherFees.housingFund',
          title: m.otherFees.housingFundTitle,
          options: getRentalOtherFeesPayeeOptions,
          width: 'half',
          space: 1,
        }),
        buildTextField({
          id: 'rentOtherFees.housingFundAmount',
          title: m.otherFees.housingFundAmountLabel,
          placeholder: m.otherFees.housingFundAmountPlaceholder,
          variant: 'currency',
          maxLength: 13,
          condition: housingFundAmountPayedByTenant,
        }),

        // Electricity cost fields
        buildRadioField({
          id: 'rentOtherFees.electricityCost',
          title: m.otherFees.electricityCostTitle,
          options: getRentalOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'rentOtherFees.electricityCostMeterNumber',
          title: m.otherFees.electricityCostMeterNumberLabel,
          placeholder: m.otherFees.electricityCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: electricityCostPayedByTenant,
        }),
        buildTextField({
          id: 'rentOtherFees.electricityCostMeterStatus',
          title: m.otherFees.electricityCostMeterStatusLabel,
          placeholder: m.otherFees.electricityCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: electricityCostPayedByTenant,
        }),
        buildDateField({
          id: 'rentOtherFees.electricityCostMeterStatusDate',
          title: m.otherFees.electricityCostMeterStatusDateLabel,
          placeholder: m.otherFees.electricityCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: electricityCostPayedByTenant,
        }),

        // Heating cost fields
        buildRadioField({
          id: 'rentOtherFees.heatingCost',
          title: m.otherFees.heatingCostTitle,
          options: getRentalOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'rentOtherFees.heatingCostMeterNumber',
          title: m.otherFees.heatingCostMeterNumberLabel,
          placeholder: m.otherFees.heatingCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: heatingCostPayedByTenant,
        }),
        buildTextField({
          id: 'rentOtherFees.heatingCostMeterStatus',
          title: m.otherFees.heatingCostMeterStatusLabel,
          placeholder: m.otherFees.heatingCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: heatingCostPayedByTenant,
        }),
        buildDateField({
          id: 'rentOtherFees.heatingCostMeterStatusDate',
          title: m.otherFees.heatingCostMeterStatusDateLabel,
          placeholder: m.otherFees.heatingCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: heatingCostPayedByTenant,
        }),

        // TODO: Add otherCosts fields when ready
        // Other fees
        // buildDescriptionField({
        //   id: 'rentOtherFees.otherCostsTitle',
        //   title: m.otherFees.otherCostsTitle,
        //   titleVariant: 'h4',
        //   space: 6,
        // }),
        // buildCheckboxField({
        //   id: 'rentOtherFees.otherCosts',
        //   title: '',
        //   options: [
        //     {
        //       value: TRUE,
        //       label: m.otherFees.otherCostsLabel,
        //     },
        //   ],
        //   spacing: 0,
        // }),
        // buildTextField({
        //   id: 'rentOtherFees.otherCostsDescription',
        //   title: m.otherFees.otherCostsDescriptionLabel,
        //   placeholder: m.otherFees.otherCostsDescriptionPlaceholder,
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
        //   title: m.otherFees.otherCostsAmountLabel,
        //   placeholder: m.otherFees.otherCostsAmountPlaceholder,
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
