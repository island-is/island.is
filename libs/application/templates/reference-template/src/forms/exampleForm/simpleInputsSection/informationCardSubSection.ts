import {
  buildInformationFormField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

export const informationCardSubSection = buildSubSection({
  id: 'informationCard',
  title: 'Information card',
  children: [
    buildMultiField({
      id: 'informationMultiField',
      title: 'Information card',
      children: [
        buildInformationFormField({
          paddingX: 3,
          paddingY: 3,
          items: () => {
            return [
              {
                label: 'Test label 1',
                value: 'Test value 1',
              },
              {
                label: 'Test label 2',
                value: 'Test value 2',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
