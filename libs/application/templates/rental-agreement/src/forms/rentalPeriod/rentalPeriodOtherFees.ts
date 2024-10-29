import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  buildDateField,
  buildDescriptionField,
  buildCheckboxField,
  buildTableRepeaterField,
  buildRepeater,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import {
  getApplicationAnswers,
  getRentalOtherFeesPayeeOptions,
} from '../../lib/utils'
import { rentOtherFeesPayeeOptions } from '../../lib/constants'
import { FormValue } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'

function housingFundAmountPayedByTenant(answers: FormValue) {
  const { rentOtherFeesHousingFund } = getApplicationAnswers(answers)
  return rentOtherFeesHousingFund === rentOtherFeesPayeeOptions.TENANT
}

function electricityCostPayedByTenant(answers: FormValue) {
  const { rentOtherFeesElectricityCost } = getApplicationAnswers(answers)
  return rentOtherFeesElectricityCost === rentOtherFeesPayeeOptions.TENANT
}

function heatingCostPayedByTenant(answers: FormValue) {
  const { rentOtherFeesHeatingCost } = getApplicationAnswers(answers)
  return rentOtherFeesHeatingCost === rentOtherFeesPayeeOptions.TENANT
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
          defaultValue: rentOtherFeesPayeeOptions.LANDLORD,
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
          defaultValue: rentOtherFeesPayeeOptions.LANDLORD,
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
          defaultValue: rentOtherFeesPayeeOptions.LANDLORD,
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
      ],
    }),
    buildTableRepeaterField({
      id: 'rentOtherFees.otherFees',
      title: 'm.otherFees.otherFeesTitle',
      description: 'm.otherFees.otherFeesDescription',
      fields: {
        name: {
          component: 'input',
          label: m.landlordDetails.nameInputLabel,
          width: 'half',
        },
        nationalId: {
          component: 'input',
          label: m.landlordDetails.nationalIdInputLabel,
          format: '######-####',
          width: 'half',
        },
      },
      table: {
        header: [
          m.landlordDetails.nameInputLabel,
          m.landlordDetails.nationalIdHeaderLabel,
        ],
      },
    }),
    buildRepeater({
      id: 'rentOtherFees.otherFees',
      title: 'm.otherFees.otherFeesTitle',
      component: 'OtherFeesRepeater',
      children: [
        buildTextField({
          id: 'otherFeesDescription',
          title: 'm.otherFees.otherFeesDescriptionLabel',
          placeholder: 'm.otherFees.otherFeesDescriptionPlaceholder',
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'otherFeesAmount',
          title: 'm.otherFees.otherFeesAmountLabel',
          placeholder: 'm.otherFees.otherFeesAmountPlaceholder',
          variant: 'currency',
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
