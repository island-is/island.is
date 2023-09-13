import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { agent, application } from '../../../lib/messages'

export const AgentSection = buildSection({
  id: 'agent',
  title: agent.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'agentMultiField',
      title: agent.labels.pageTitle,
      description: agent.labels.description,
      children: [
        buildRadioField({
          id: 'agent.title',
          title: agent.labels.title,
          options: [
            {
              label: application.radioOptionNo,
              value: 'NO',
            },
            {
              label: application.radioOptionYes,
              value: 'YES',
            },
          ],
        }),
      ],
    }),
  ],
})
