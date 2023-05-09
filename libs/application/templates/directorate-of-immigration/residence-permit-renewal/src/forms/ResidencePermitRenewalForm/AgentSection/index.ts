import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { agent } from '../../../lib/messages'

export const AgentSection = buildSection({
  id: 'agent',
  title: agent.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'agentMultiField',
      title: agent.labels.pageTitle,
      description: agent.labels.description,
      children: [
        buildDescriptionField({
          id: 'agent.title',
          title: agent.labels.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
