import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { BasicInfoSection } from './basicInfoSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [BasicInfoSection],
})
