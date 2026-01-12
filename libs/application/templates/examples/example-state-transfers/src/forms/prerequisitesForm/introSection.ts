import { buildMultiField, buildSection } from '@island.is/application/core'

import { buildDescriptionField } from '@island.is/application/core'

export const introSection = buildSection({
  id: 'intro',
  tabTitle: 'Prerequisites',
  children: [
    buildMultiField({
      id: 'multiField',
      title: 'The Prerequisites State',
      children: [
        buildDescriptionField({
          id: 'prerequisitesDescription',
          description:
            'All applications should start in the Prerequisites state.',
        }),
        buildDescriptionField({
          id: 'prerequisitesDescription2',
          description:
            'In this state, the user should approve that external data is fetched.',
        }),
        buildDescriptionField({
          id: 'prerequisitesDescription3',
          description:
            'Note that the stepper can be omitted in this state since it is only one step in most cases --->.',
        }),
      ],
    }),
  ],
})
