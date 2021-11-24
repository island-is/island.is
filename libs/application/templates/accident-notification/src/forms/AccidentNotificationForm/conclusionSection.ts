import { buildCustomField, buildSection } from '@island.is/application/core'
import { conclusion } from '../../lib/messages'

export const conclusionSection = buildSection({
  id: 'conclusion.section',
  title: conclusion.general.title,
  children: [
    buildCustomField({
      id: 'conclusion.information',
      title: conclusion.general.title,
      component: 'FormConclusion',
    }),
  ],
})
