import { buildSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'
import { employeeSubSection } from './employee'

export const employeeSection = buildSection({
  id: 'employeeSection',
  title: sections.draft.employee,
  children: [employeeSubSection],
})
