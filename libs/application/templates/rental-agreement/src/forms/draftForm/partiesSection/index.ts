import { buildSection } from '@island.is/application/core'
import { partiesSubsection } from './partiesSubsection'
import * as m from '../../../lib/messages'

export const PartiesSection = buildSection({
  id: 'partiesSection',
  title: m.partiesDetails.subSectionName,
  children: [partiesSubsection],
})
