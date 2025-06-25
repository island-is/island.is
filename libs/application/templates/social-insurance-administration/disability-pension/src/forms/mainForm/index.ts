import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { selfEvaluationSection } from './selfEvaluationSection'
import { basicInfoSection } from './basicInfoSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [basicInfoSection, selfEvaluationSection],
})
