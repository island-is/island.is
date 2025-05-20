import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const aboutSection = buildSection({
  id: 'aboutSection',
  title: 'Auth delegation',
  children: [
    buildMultiField({
      id: 'regularLoginFields',
      title: 'Auth delegation',
      children: [
        buildDescriptionField({
          id: 'regularLoginDescription',
          description:
            'You are now logged in as a regular user. Swap to any auth delegation to view the form that will be loaded instead of this one.',
        }),
      ],
    }),
  ],
})
