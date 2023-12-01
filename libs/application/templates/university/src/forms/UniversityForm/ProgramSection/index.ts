import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ProgramSubSection } from './ProgramSubSection'

export const ProgramSection = buildSection({
  id: 'personal',
  title: information.labels.programSelection.title,
  children: [ProgramSubSection],
})
