import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { sharedMessages } from '../../lib/messages'

export const delegationSection = buildSection({
  id: 'delegationSection',
  title: 'Þjónustuaðili',
  children: [
    buildMultiField({
      id: 'delegationSection',
      title: 'Þjónustuaðili',
      nextButtonText: sharedMessages.nextButton,
      children: [
        buildDescriptionField({
          id: 'delegationDescription',
          title: 'Placeholder',
          description:
            'Placeholder for the umboð/þjónustuaðili-specific questions, should come from messages.ts',
        }),
      ],
    }),
  ],
})
