import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { participants as participantMessages } from '../../../lib/messages'

export const participantsSection = buildSection({
  id: 'participants',
  title: participantMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'participantsMultiField',
      title: participantMessages.general.pageTitle,
      description: participantMessages.general.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
          title: 'test',
        }),
      ],
    }),
  ],
})
