import { buildRadioField, buildSubSection } from '@island.is/application/core'

export const radioSubsection = buildSubSection({
  id: 'radio',
  title: 'Radio',
  children: [
    buildRadioField({
      id: 'radio',
      title: 'Radio',
      options: [
        {
          label: 'Radio 1',
          value: 'radio1',
        },
        {
          label: 'Radio 2',
          value: 'radio2',
        },
        {
          label: 'Radio 3',
          value: 'radio3',
        },
      ],
    }),
  ],
})
