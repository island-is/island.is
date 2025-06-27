import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { personalInformationSection } from './personalInformationSection'
import { overviewSection } from './overviewSection'
import { changesSection } from './changesSection'
import { realEstateSection } from './realEstateSection'
import { photoSection } from './photoSection'
import HmsLogo from '../../assets/HmsLogo'

export const MainForm = buildForm({
  id: 'MainForm',
  logo: HmsLogo,
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
