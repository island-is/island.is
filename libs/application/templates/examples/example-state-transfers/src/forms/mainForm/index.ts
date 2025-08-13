import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { firstScreenSection } from './firstScreenSection'
import { statesAndStatusSection } from './statesAndStatusSection'
import { assigneeInfoSection } from './assigneeInfolSection'
import { overviewSection } from './overviewSection'

export const MainForm: Form = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    firstScreenSection,
    statesAndStatusSection,
    assigneeInfoSection,
    overviewSection,
  ],
})
