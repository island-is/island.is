import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  buildDateField,
  buildDescriptionField,
  buildCheckboxField,
  YesOrNoEnum,
  buildFieldsRepeaterField,
} from '@island.is/application/core'
import { OtherFeesPayeeOptions, Routes } from '../../../utils/enums'
import {
  electricityCostPayedByTenant,
  heatingCostPayedByTenant,
  housingFundAmountPayedByTenant,
  otherFeesPayedByTenant,
} from '../../../utils/rentalPeriodUtils'
import { getOtherFeesPayeeOptions } from '../../../utils/options'
import * as m from '../../../lib/messages'

export const otherFeesSubsection = buildSubSection({
  id: Routes.OTHERFEES,
  title: m.otherFees.subSectionName,
  children: [
    buildMultiField({
      id: Routes.OTHERFEES,
      title: m.otherFees.pageTitle,
      description: m.otherFees.pageDescription,
      children: [
        buildRadioField({
          id: 'otherFees.housingFund',
          title: m.otherFees.housingFundTitle,
          clearOnChange: ['otherFees.housingFundAmount'],
          options: getOtherFeesPayeeOptions,
          defaultValue: OtherFeesPayeeOptions.LANDLORD,
          width: 'half',
          space: 1,
        }),
        buildTextField({
          id: 'otherFees.housingFundAmount',
          title: m.otherFees.housingFundAmountLabel,
          placeholder: m.otherFees.housingFundAmountPlaceholder,
          variant: 'currency',
          maxLength: 13,
          condition: housingFundAmountPayedByTenant,
        }),

        // Electricity cost fields
        buildRadioField({
          id: 'otherFees.electricityCost',
          title: m.otherFees.electricityCostTitle,
          clearOnChange: [
            'otherFees.electricityCostMeterNumber',
            'otherFees.electricityCostMeterStatus',
            'otherFees.electricityCostMeterStatusDate',
          ],
          options: getOtherFeesPayeeOptions,
          defaultValue: OtherFeesPayeeOptions.LANDLORD,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'otherFees.electricityCostMeterNumber',
          title: m.otherFees.electricityCostMeterNumberLabel,
          placeholder: m.otherFees.electricityCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: electricityCostPayedByTenant,
          variant: 'number',
        }),
        buildTextField({
          id: 'otherFees.electricityCostMeterStatus',
          title: m.otherFees.electricityCostMeterStatusLabel,
          placeholder: m.otherFees.electricityCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: electricityCostPayedByTenant,
          variant: 'number',
        }),
        buildDateField({
          id: 'otherFees.electricityCostMeterStatusDate',
          title: m.otherFees.electricityCostMeterStatusDateLabel,
          placeholder: m.otherFees.electricityCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: electricityCostPayedByTenant,
          minDate: new Date(2023, 0, 1),
        }),

        // Heating cost fields
        buildRadioField({
          id: 'otherFees.heatingCost',
          title: m.otherFees.heatingCostTitle,
          clearOnChange: [
            'otherFees.heatingCostMeterNumber',
            'otherFees.heatingCostMeterStatus',
            'otherFees.heatingCostMeterStatusDate',
          ],
          options: getOtherFeesPayeeOptions,
          defaultValue: OtherFeesPayeeOptions.LANDLORD,
          width: 'half',
          space: 6,
        }),
        buildTextField({
          id: 'otherFees.heatingCostMeterNumber',
          title: m.otherFees.heatingCostMeterNumberLabel,
          placeholder: m.otherFees.heatingCostMeterNumberPlaceholder,
          width: 'half',
          maxLength: 20,
          condition: heatingCostPayedByTenant,
          variant: 'number',
        }),
        buildTextField({
          id: 'otherFees.heatingCostMeterStatus',
          title: m.otherFees.heatingCostMeterStatusLabel,
          placeholder: m.otherFees.heatingCostMeterStatusPlaceholder,
          width: 'half',
          maxLength: 10,
          condition: heatingCostPayedByTenant,
          variant: 'number',
        }),
        buildDateField({
          id: 'otherFees.heatingCostMeterStatusDate',
          title: m.otherFees.heatingCostMeterStatusDateLabel,
          placeholder: m.otherFees.heatingCostMeterStatusDatePlaceholder,
          width: 'half',
          condition: heatingCostPayedByTenant,
          minDate: new Date(2023, 0, 1),
        }),

        // Other fees
        buildDescriptionField({
          id: 'otherFees.otherCostsTitle',
          title: m.otherFees.otherCostsTitle,
          titleVariant: 'h4',
          space: 6,
        }),
        buildCheckboxField({
          id: 'otherFees.otherCosts',
          options: [
            {
              value: YesOrNoEnum.YES,
              label: m.otherFees.otherCostsLabel,
            },
          ],
          spacing: 0,
          clearOnChange: ['otherFees.otherCostItems'],
        }),
        buildFieldsRepeaterField({
          id: 'otherFees.otherCostItems',
          formTitleNumbering: 'none',
          minRows: 0,
          maxRows: 3,
          condition: otherFeesPayedByTenant,
          fields: {
            description: {
              component: 'input',
              label: m.otherFees.otherCostsDescriptionLabel,
              width: 'half',
              type: 'text',
            },
            amount: {
              component: 'input',
              label: m.otherFees.otherCostsAmountLabel,
              width: 'half',
              type: 'number',
              currency: true,
              maxLength: 10,
            },
          },
        }),
      ],
    }),
  ],
})
