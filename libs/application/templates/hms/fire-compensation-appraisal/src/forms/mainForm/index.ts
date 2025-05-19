import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { personalInformationSection } from './personalInformationSection'
import { overviewSection } from './overview'
import { changesSection } from './changesSection'
import { realEstateSection } from './realEstateSection'
import { photoSection } from './photoSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    personalInformationSection,
    realEstateSection,
    changesSection,
    photoSection,
    overviewSection,
  ],
})
