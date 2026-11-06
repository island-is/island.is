import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { homeLodgingSection } from './homeLodgingSection'
import { overnightStayRegistrationSection } from './overnightStayRegistrationSection'
import { overviewSection } from './overview'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    homeLodgingSection,
    overnightStayRegistrationSection,
    overviewSection,
  ],
})
