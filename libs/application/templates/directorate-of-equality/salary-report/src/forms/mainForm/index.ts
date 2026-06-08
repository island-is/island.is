import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { aboutTheCompanySection } from './aboutTheCompanySection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [aboutTheCompanySection],
})
