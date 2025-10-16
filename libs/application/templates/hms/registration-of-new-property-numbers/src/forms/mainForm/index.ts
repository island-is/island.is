import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { overviewSection } from './overviewSection'
import { personalInformationSection } from './personalInformationSection'
import { contactSection } from './contactSection'
import { realEstateSection } from './realEstateSection'
import { paymentOverviewSection } from './paymentOverviewSection'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    personalInformationSection,
    contactSection,
    realEstateSection,
    overviewSection,
    paymentOverviewSection,
  ],
})
