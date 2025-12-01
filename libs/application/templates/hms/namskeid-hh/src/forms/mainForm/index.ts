import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewSection } from './overviewSection'
import { personalInformationSection } from './personalInformationSection'
import { contactSection } from './contactSection'
import { paymentOverviewSection } from './paymentOverviewSection'
import { HmsLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  logo: HmsLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    personalInformationSection,
    contactSection,
    overviewSection,
    paymentOverviewSection,
  ],
})

