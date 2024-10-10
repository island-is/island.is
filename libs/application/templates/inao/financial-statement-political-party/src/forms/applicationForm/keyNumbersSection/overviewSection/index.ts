import { buildSection } from '@island.is/application/core'
import { overviewMultiField } from './overviewMultiField'
import { m } from '../../../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [overviewMultiField],
})
