import {
  buildAccordionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const accordionSection = buildSection({
  id: 'accordionSection',
  title: 'Accordion',
  children: [
    buildMultiField({
      id: 'accordionMultiField',
      title: 'BuildMultiField',
      children: [
        buildAccordionField({
          id: 'accordion',
          title: 'Accordion',
          accordionItems: [
            {
              itemTitle: 'Item 1',
              itemContent:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            },
            {
              itemTitle: 'Item 2',
              itemContent:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
          ],
        }),
      ],
    }),
  ],
})
