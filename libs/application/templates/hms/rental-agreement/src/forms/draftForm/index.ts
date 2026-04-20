import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { rentalHousingSection } from './rentalPropertySection'
import { rentalPeriodSection } from './rentalPeriodSection'
import { overviewSection } from './overviewSection'
import { partiesSection } from './partiesSection'
import { costsSection } from './costsSection'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'

export const draftForm = buildForm({
  id: 'draftForm',
  title: m.application.name,
  logo: HmsLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    partiesSection,
    rentalHousingSection,
    rentalPeriodSection,
    costsSection,
    overviewSection,
  ],
})
