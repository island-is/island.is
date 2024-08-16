import { buildSubSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'

export const circumstancesSection = buildSubSection({
  id: 'about',
  title: sections.draft.circumstances,
  children: [],
})
