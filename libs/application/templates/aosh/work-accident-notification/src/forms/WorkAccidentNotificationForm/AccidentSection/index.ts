import { buildSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'
import { aboutSection } from './about'

export const accidentSection = buildSection({
  id: 'informationSection',
  title: sections.draft.accident,
  children: [],
})
