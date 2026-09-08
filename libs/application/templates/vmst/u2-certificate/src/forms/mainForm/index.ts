import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { countryAndDateSection } from './countryAndDateSection'
import { overviewSection } from './overview'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { importantInfoSection } from './importantInfoSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: DirectorateOfLabourLogo,
  children: [countryAndDateSection, importantInfoSection, overviewSection],
})
