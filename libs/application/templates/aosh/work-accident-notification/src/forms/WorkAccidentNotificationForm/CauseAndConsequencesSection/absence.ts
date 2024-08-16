import { buildSubSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'

export const absenceSection = buildSubSection({
  id: 'about',
  title: sections.draft.absence,
  children: [],
})
