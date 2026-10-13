import {
  buildSection,
  buildMultiField,
  buildCheckboxField,
  buildAlertMessageField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { INCOME_TYPE_ANSWER_KEYS } from '../../utils/constants'

export const selectIncomeSection = buildSection({
  id: 'selectIncomeSection',
  title: m.application.selectIncomeSectionTitle,
  children: [
    buildMultiField({
      id: 'incomeType',
      title: m.application.pageTitle,
      description: m.application.pageDescription,
      children: [
        buildAlertMessageField({
          id: 'incomeTypeAlert',
          title: m.application.incomeTypeAlertTitle,
          message: m.application.incomeTypeAlert,
          alertType: 'info',
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: 'typeOfIncome',
          title: m.application.incomeTypeTitle,
          required: true,
          large: false,
          backgroundColor: 'white',
          width: 'half',
          spacing: 2,
          // Only wipe deselected categories; clearing every category would
          // discard the additions and deletions made in the ones still selected.
          setOnChange: async (optionValue) => {
            const selected = Array.isArray(optionValue) ? optionValue : []

            return Object.entries(INCOME_TYPE_ANSWER_KEYS)
              .filter(([incomeType]) => !selected.includes(incomeType))
              .map(([, answerKey]) => ({ key: answerKey, value: undefined }))
          },
          options: [
            {
              value: 'casualWork',
              label: m.application.incomeTypeCasualWork,
            },
            { value: 'partTime', label: m.application.incomeTypePartTime },
            {
              value: 'contractWork',
              label: m.application.incomeTypeContractWork,
            },
            { value: 'pension', label: m.application.incomeTypePension },
            {
              value: 'capitalIncome',
              label: m.application.incomeTypeCapitalIncome,
            },
            {
              value: 'socialInsurance',
              label: m.application.incomeTypeSocialInsurance,
            },
          ],
        }),
      ],
    }),
  ],
})
