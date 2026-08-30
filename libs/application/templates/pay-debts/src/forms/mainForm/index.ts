import { buildForm, buildSection } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { completedForm as messages } from '../../lib/messages'
import { debtsSection } from './debtsSection'
import { paymentSection } from './paymentSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    debtsSection,
    paymentSection,
    buildSection({
      id: 'completedSection',
      title: messages.sectionTitle,
      children: [],
    }),
  ],
})
