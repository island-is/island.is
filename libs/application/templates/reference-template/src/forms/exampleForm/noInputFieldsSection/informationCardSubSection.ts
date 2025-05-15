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
          items: (application, field, locale) => {
            return [
              {
                label: locale === 'is' ? 'Test label is 1' : 'Test label en 1',
                value: 'Test value 1',
              },
              {
                label: locale === 'is' ? 'Test label is 2' : 'Test label en 2',
                value: 'Test value 2',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
