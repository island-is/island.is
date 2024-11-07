import { buildSection } from '@island.is/application/core'
import { application } from '../lib/messages'

export const Summary = buildSection({
  id: 'summary',
  title: application.summarySectionName,
  children: [],
})
