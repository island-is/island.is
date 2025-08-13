import { buildForm } from '@island.is/application/core'
import { aboutSection } from './aboutSection'

import { overviewSection } from '../overview'
import { roleSection } from '../rolesSection'

export const PowerOfAttorneyForm = buildForm({
  id: 'PowerOfAttorneyForm',
  title: 'Power of attorney Form',
  renderLastScreenButton: true,
  children: [aboutSection, roleSection, overviewSection],
})
