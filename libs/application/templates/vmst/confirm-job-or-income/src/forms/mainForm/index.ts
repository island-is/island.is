import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { casualWorkSection } from './casualWorkSection'
import { partTimeSection } from './partTimeSection'
import { contractWorkSection } from './contractWorkSection'
import { pensionSection } from './pensionSection'
import { capitalIncomeSection } from './capitalIncomeSection'
import { socialInsuranceSection } from './socialInsuranceSection'
import { incomeSection } from './selectIncomeSection'
import { overviewSection } from './overviewSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    incomeSection,
    casualWorkSection,
    partTimeSection,
    contractWorkSection,
    pensionSection,
    capitalIncomeSection,
    socialInsuranceSection,
    overviewSection,
  ],
})
