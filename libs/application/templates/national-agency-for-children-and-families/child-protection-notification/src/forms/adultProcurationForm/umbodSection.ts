import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const umbodSection = buildSection({
  id: 'umbodSection',
  title: 'Þjónustuaðili',
  children: [
    buildMultiField({
      id: 'umbodSection',
      title: 'Þjónustuaðili',
      children: [
        buildDescriptionField({
          id: 'umbodDescription',
          title: 'Placeholder',
          description:
            'Placeholder for the umboð/þjónustuaðili-specific questions, should come from messages.ts',
        }),
      ],
    }),
  ],
})
