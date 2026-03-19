import { buildCheckboxField, buildSection } from '@island.is/application/core'

export const mockDataSection = buildSection({
  id: 'mockDataSection',
  title: 'Mock Data Section',
  children: [
    buildCheckboxField({
      id: 'mockData',
      title: 'Mock Data',
      options: [
        {
          value: 'yes',
          label: 'Yes',
        },
      ],
    }),
  ],
})
