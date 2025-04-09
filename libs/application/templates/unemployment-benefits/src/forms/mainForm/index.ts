import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewSection } from './overview'
import { firstSectionInformation } from './firstSectionInformation'
import { applicantSection } from './applicantSection'
import { secondSectionInformation } from './secondSectionInformation'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    firstSectionInformation,
    applicantSection,
    secondSectionInformation,
    overviewSection,
  ],
})
