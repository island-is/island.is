import {
  buildSection,
  buildMultiField,
  buildCheckboxField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const selectIncomeSection = buildSection({
  id: 'selectIncomeSection',
  title: m.application.selectIncomeSectionTitle,
  children: [
    buildMultiField({
      id: 'incomeType',
      title: m.application.pageTitle,
      description: m.application.pageDescription,
      children: [
        buildCheckboxField({
          id: 'typeOfIncome',
          title: m.application.incomeTypeTitle,
          required: true,
          large: false,
          backgroundColor: 'white',
          width: 'half',
          spacing: 2,
          setOnChange: async () => {
            return [
              { key: 'registerCasualWork', value: undefined },
              { key: 'registerPartTime', value: undefined },
              { key: 'registerContractWork', value: undefined },
              { key: 'registerCapitalIncome', value: undefined },
              { key: 'registerSocialInsurance', value: undefined },
              { key: 'registerPension', value: undefined },
            ]
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
