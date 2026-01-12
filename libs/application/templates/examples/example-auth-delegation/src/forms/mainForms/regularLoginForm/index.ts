import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { aboutSection } from './aboutSection'
import { overviewSection } from '../overview'
import { roleSection } from '../rolesSection'

export const RegularLoginForm = buildForm({
  id: 'RegularLoginForm',
  title: 'Regular login Form',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [aboutSection, roleSection, overviewSection],
})
