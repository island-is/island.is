import {
  buildActionCardListField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { applicationStatus } from '../../lib/messages'

export const applicationStatusSection = buildSection({
  id: 'applicationStatusSection',
  title: applicationStatus.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicationStatusSection.multiField',
      title: applicationStatus.general.title,
      description: applicationStatus.general.description,
      children: [
        buildActionCardListField({
          id: 'approvalActionCard',
          doesNotRequireAnswer: true,
          marginTop: 2,
          title: '',
          items: () => [
            {
              heading: applicationStatus.labels.actionCardTitle,
              tag: {
                label: applicationStatus.labels.actionCardTag,
                outlined: false,
                variant: 'purple',
              },
              text: applicationStatus.labels.actionCardMessage,
            },
          ],
        }),
      ],
    }),
  ],
})
