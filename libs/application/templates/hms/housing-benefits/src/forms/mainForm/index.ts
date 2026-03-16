import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { personalInformationSection } from './personalInformationSection'
import { overviewSection } from './overview'
import { HmsLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: HmsLogo,
  children: [personalInformationSection, overviewSection],
})
