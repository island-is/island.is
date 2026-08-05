import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import {
  contractorIncomeSelected,
  foreignIncomeSelected,
  incomeOtherIncomeYes,
  incomeRadioClearChildren,
  otherIncomeSelected,
} from '../../utils/incomeSectionUtils'
import { isTaxReturnFiled } from '../../utils/utils'

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: m.draftMessages.incomeSection.title,
  condition: isTaxReturnFiled,
  children: [
    buildMultiField({
      id: 'incomeMultiField',
      title: m.draftMessages.incomeSection.multiFieldTitle,
      description: m.draftMessages.incomeSection.multiFieldDescription,
      children: [
        buildRadioField({
          id: 'incomeHasOtherIncome',
          title: m.draftMessages.incomeSection.hasOtherIncomeQuestion,
          titleVariant: 'h3',
          marginBottom: 4,
          required: true,
          clearOnChange: [...incomeRadioClearChildren],
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.optionYes,
            },
            {
              value: NO,
              label: m.draftMessages.incomeSection.optionNo,
            },
          ],
        }),
        buildDescriptionField({
          id: 'incomeOtherIncomeTypesIntro',
          title: m.draftMessages.incomeSection.otherIncomeTypesTitle,
          titleVariant: 'h3',
          marginBottom: 2,
          condition: incomeOtherIncomeYes,
        }),
        buildCheckboxField({
          id: 'incomeContractorCheckbox',
          condition: incomeOtherIncomeYes,
          clearOnChange: ['incomeContractorDescription'],
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.checkboxContractor,
            },
          ],
          marginBottom: 2,
        }),
        buildTextField({
          id: 'incomeContractorDescription',
          title: m.draftMessages.incomeSection.contractorDescriptionTitle,
          description:
            m.draftMessages.incomeSection.contractorDescriptionDescription,
          variant: 'currency',
          allowNegative: false,
          marginBottom: 2,
          condition: contractorIncomeSelected,
        }),
        buildCheckboxField({
          id: 'incomeForeignCheckbox',
          condition: incomeOtherIncomeYes,
          clearOnChange: ['incomeForeignDescription'],
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.checkboxForeign,
            },
          ],
          marginBottom: 2,
        }),
        buildTextField({
          id: 'incomeForeignDescription',
          title: m.draftMessages.incomeSection.foreignDescriptionTitle,
          description:
            m.draftMessages.incomeSection.foreignDescriptionDescription,
          variant: 'currency',
          allowNegative: false,
          marginBottom: 2,
          condition: foreignIncomeSelected,
        }),
        buildCheckboxField({
          id: 'incomeOtherCheckbox',
          condition: incomeOtherIncomeYes,
          clearOnChange: ['incomeOtherDescription'],
          options: [
            {
              value: YES,
              label: m.draftMessages.incomeSection.checkboxOther,
            },
          ],
          marginBottom: 2,
        }),
        buildTextField({
          id: 'incomeOtherDescription',
          title: m.draftMessages.incomeSection.otherDescriptionTitle,
          description:
            m.draftMessages.incomeSection.otherDescriptionDescription,
          variant: 'currency',
          allowNegative: false,
          condition: otherIncomeSelected,
        }),
      ],
    }),
  ],
})
