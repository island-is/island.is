import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { mainSection } from '../mainForm/mainSection'
import { overviewSection } from './overview'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [mainSection, overviewSection],
})
