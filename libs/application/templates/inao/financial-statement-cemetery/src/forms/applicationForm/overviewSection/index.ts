import { buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { overviewMultiField } from './oveviewMultiField'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [overviewMultiField],
})
