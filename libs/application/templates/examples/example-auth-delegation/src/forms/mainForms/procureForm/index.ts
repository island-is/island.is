import { buildForm } from '@island.is/application/core'
import { aboutSection } from './aboutSection'
import { overviewSection } from '../overview'
import { roleSection } from '../rolesSection'

export const ProcureForm = buildForm({
  id: 'ProcureForm',
  title: 'Procure Form',
  renderLastScreenButton: true,
  children: [aboutSection, roleSection, overviewSection],
})
