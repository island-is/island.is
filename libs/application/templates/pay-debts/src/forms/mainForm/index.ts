import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { debtsSection } from './debtsSection'
import { paymentSection } from './paymentSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [debtsSection, paymentSection],
})
