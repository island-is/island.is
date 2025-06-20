import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  buildDateField,
  buildDescriptionField,
  buildCheckboxField,
  buildCustomField,
  YesOrNoEnum,
} from '@island.is/application/core'
import { getOtherFeesPayeeOptions } from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import {
  electricityCostPayedByTenant,
  heatingCostPayedByTenant,
  housingFundAmountPayedByTenant,
  otherFeesPayedByTenant,
} from '../../../utils/rentalPeriodUtils'
import { otherFees } from '../../../lib/messages'

export const RentalPeriodOtherFees = buildSubSection({
  id: Routes.OTHERFEES,
  title: otherFees.subSectionName,
  children: [
    buildMultiField({
      id: Routes.OTHERFEES,
      title: otherFees.pageTitle,
      description: otherFees.pageDescription,
      children: [
        buildRadioField({
          id: 'otherFees.housingFund',
          title: otherFees.housingFundTitle,
          clearOnChange: ['otherFees.housingFundAmount'],
          options: getOtherFeesPayeeOptions,
          width: 'half',
          space: 1,
        }),
        buildTextField({
          id: 'otherFees.housingFundAmount',
          title: otherFees.housingFundAmountLabel,
          placeholder: otherFees.housingFundAmountPlaceholder,
          variant: 'currency',
          maxLength: 13,
          condition: housingFundAmountPayedByTenant,
        }),

        // Electricity cost fields
        buildRadioField({
          id: 'otherFees.electricityCost',
          title: otherFees.electricityCostTitle,
          clearOnChange: [
            'otherFees.electricityCostMeterNumber',
            'otherFees.electricityCostMeterStatus',
            'otherFees.electricityCostMeterStatusDate',
          ],
          options: getOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'otherFees.electricityCostMeterNumber',
          title: otherFees.electricityCostMeterNumberLabel,
          placeholder: otherFees.electricityCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: electricityCostPayedByTenant,
          variant: 'number',
        }),
        buildTextField({
          id: 'otherFees.electricityCostMeterStatus',
          title: otherFees.electricityCostMeterStatusLabel,
          placeholder: otherFees.electricityCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: electricityCostPayedByTenant,
          variant: 'number',
        }),
        buildDateField({
          id: 'otherFees.electricityCostMeterStatusDate',
          title: otherFees.electricityCostMeterStatusDateLabel,
          placeholder: otherFees.electricityCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: electricityCostPayedByTenant,
        }),

        // Heating cost fields
        buildRadioField({
          id: 'otherFees.heatingCost',
          title: otherFees.heatingCostTitle,
          clearOnChange: [
            'otherFees.heatingCostMeterNumber',
            'otherFees.heatingCostMeterStatus',
            'otherFees.heatingCostMeterStatusDate',
          ],
          options: getOtherFeesPayeeOptions,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'otherFees.heatingCostMeterNumber',
          title: otherFees.heatingCostMeterNumberLabel,
          placeholder: otherFees.heatingCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: heatingCostPayedByTenant,
          variant: 'number',
        }),
        buildTextField({
          id: 'otherFees.heatingCostMeterStatus',
          title: otherFees.heatingCostMeterStatusLabel,
          placeholder: otherFees.heatingCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: heatingCostPayedByTenant,
          variant: 'number',
        }),
        buildDateField({
          id: 'otherFees.heatingCostMeterStatusDate',
          title: otherFees.heatingCostMeterStatusDateLabel,
          placeholder: otherFees.heatingCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: heatingCostPayedByTenant,
        }),

        // Other fees
        buildDescriptionField({
          id: 'otherFees.otherCostsTitle',
          title: otherFees.otherCostsTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'otherFees.otherCosts',
          options: [
            {
              value: YesOrNoEnum.YES,
              label: otherFees.otherCostsLabel,
            },
          ],
          spacing: 0,
          clearOnChange: ['otherFees.otherCostItems'],
        }),
        buildCustomField({
          id: 'otherFees.otherCostItems',
          component: 'OtherCostItems',
          condition: otherFeesPayedByTenant,
        }),
      ],
    }),
  ],
})
