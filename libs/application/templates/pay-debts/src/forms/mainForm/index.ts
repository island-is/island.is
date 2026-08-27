import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { debtsSection } from './debtsSection'
import { paymentSection } from './paymentSection'
import { overviewSection } from './overview'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [debtsSection, paymentSection, overviewSection],
})
