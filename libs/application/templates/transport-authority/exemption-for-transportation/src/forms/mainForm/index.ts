import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { userInformationSection } from './userInformationSection'
import { exemptionPeriodSection } from './exemptionPeriodSection'
import { convoySection } from './convoySection'
import { freightSection } from './freightSection'
import { axleSpacingSection } from './axleSpacingSection'
import { vehicleSpacingSection } from './vehicleSpacingSection'
import { locationSection } from './locationSection'
import { supportingDocumentsSection } from './supportingDocumentsSection'
import { overviewSection } from './overviewSection'
import { Logo } from '../../assets/Logo'

export const MainForm = buildForm({
  id: 'MainForm',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    userInformationSection,
    exemptionPeriodSection,
    convoySection,
    freightSection,
    axleSpacingSection,
    vehicleSpacingSection,
    locationSection,
    supportingDocumentsSection,
    overviewSection,
  ],
})
