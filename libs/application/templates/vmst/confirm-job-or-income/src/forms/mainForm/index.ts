import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { selectIncomeSection } from './selectIncomeSection'
import { registerIncomeSection } from './registerIncomeSection'
import { overviewSection } from './overviewSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: DirectorateOfLabourLogo,
  children: [selectIncomeSection, registerIncomeSection, overviewSection],
})
