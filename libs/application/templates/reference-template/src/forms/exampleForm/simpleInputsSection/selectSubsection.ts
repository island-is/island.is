import { buildSelectField, buildSubSection } from '@island.is/application/core'

export const selectSubsection = buildSubSection({
  id: 'select',
  title: 'Select',
  children: [
    buildSelectField({
      id: 'select',
      title: 'Select',
      options: [
        {
          label: 'Select 1',
          value: 'select1',
        },
        {
          label: 'Select 2',
          value: 'select2',
        },
        {
          label: 'Select 3',
          value: 'select3',
        },
      ],
    }),
  ],
})
