import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { sharedMessages } from '../../lib/messages'

export const minorFirstSection = buildSection({
  id: 'minorFirstSection',
  title: 'Hvað veldur þér áhyggjum?',
  children: [
    buildMultiField({
      id: 'minorFirstSection',
      title: 'Hvað veldur þér áhyggjum?',
      nextButtonText: sharedMessages.nextButton,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'Placeholder',
          description:
            'Placeholder for the minor self-report questions, should come from messages.ts',
        }),
        buildRadioField({
          id: 'wantsToShare',
          title: 'Viltu segja okkur frá því sem veldur þér áhyggjum?',
          options: [
            { label: 'Já, ég vil segja frá', value: 'yes' },
            { label: 'Ég er ekki viss', value: 'unsure' },
          ],
        }),
      ],
    }),
  ],
})
