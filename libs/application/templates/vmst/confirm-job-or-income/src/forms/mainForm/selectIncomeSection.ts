import {
  buildSection,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: m.application.incomeSectionTitle,
  children: [
    buildMultiField({
      id: 'incomeType',
      title: m.application.pageTitle,
      children: [
        buildDescriptionField({
          id: 'incomeTypeDescription',
          description: m.application.pageDescription,
        }),
        buildDescriptionField({
          id: 'incomeTypePageInfo',
          title: m.application.pageInfo,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'typeOfIncome',
          title: m.application.incomeTypeTitle,
          required: true,
          isMulti: true,
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
