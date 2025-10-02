import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { rentalHousingSection } from './rentalPropertySection'
import { rentalPeriodSection } from './rentalPeriodSection'
import { overviewSection } from './overviewSection'
import { partiesSection } from './partiesSection'
import { costsSection } from './costsSection'
import Logo from '../../assets/Logo'
import * as m from '../../lib/messages'

export const draftForm = buildForm({
  id: 'draftForm',
  title: m.application.name,
  logo: Logo,
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
