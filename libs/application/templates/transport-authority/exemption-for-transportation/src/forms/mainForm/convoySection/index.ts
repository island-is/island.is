import { buildSection } from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import { ConvoyShortTermMultiField } from './convoyShortTerm'
import { ConvoyLongTermMultiField } from './convoyLongTerm'

export const convoySection = buildSection({
  id: 'convoySection',
  title: convoy.general.sectionTitle,
  children: [ConvoyShortTermMultiField, ConvoyLongTermMultiField],
})
