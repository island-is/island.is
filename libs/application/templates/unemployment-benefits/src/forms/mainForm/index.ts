import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { secondSection } from '../mainForm/secondSection'
import { overviewSection } from './overview'
import { firstSectionInformation } from './firstSectionInformation'
import { applicantSection } from './applicantSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    firstSectionInformation,
    applicantSection,
    secondSection,
    overviewSection,
  ],
})
