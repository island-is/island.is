import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const firstSection = buildSection({
  id: 'firstSection',
  title: 'First section',
  children: [
    buildMultiField({
      id: 'firstSection',
      title: 'Example - Folder Structure and Conventions',
      children: [
        buildDescriptionField({
          id: 'description',
          description:
            'This application does not have anything special going on visually. The code and README.md for this application showcase the standard folder structure for applications and covers some coding conventions and what to avoid.',
        }),
      ],
    }),
  ],
})
