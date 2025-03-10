import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const introSection = buildSection({
  id: 'introSection',
  title: 'Intro Section',
  children: [
    buildMultiField({
      id: 'introMultiField',
      title: 'Example fields',
      children: [
        buildDescriptionField({
          id: 'introDescription',
          description:
            'This application walks through all the different possibilities that the application system offers for input related fields.',
        }),
        buildDescriptionField({
          id: 'introDescriotion2',
          description:
            'For examples on fields with no inputs, like descriptions, alerts, accordions, keyValue and so on, visit ```/umsoknir/example-no-inputs```',
        }),
      ],
    }),
  ],
})
