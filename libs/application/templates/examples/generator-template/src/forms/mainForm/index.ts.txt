import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { firstSection } from '../mainForm/firstSection'
import { secondSection } from '../mainForm/secondSection'
import { overviewSection } from './overview'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [firstSection, secondSection, overviewSection],
})
