import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../../assets/Logo'
import { rentalHousingSection } from './rentalPropertySection'
import { rentalPeriodSection } from './rentalPeriodSection'
import { overviewSection } from './overviewSection'

import { application } from '../../lib/messages'
import { partiesSection } from './partiesSection'
import { costsSection } from './costsSection'

export const draftForm: Form = buildForm({
  id: 'draftForm',
  title: application.name,
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
