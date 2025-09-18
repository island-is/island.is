import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { RentalHousingSection } from './draft/rentalHousingSection'
import { RentalPeriodSection } from './draft/rentalPeriodSection'
import { overviewSection } from './draft/overviewSection'

import { application } from '../lib/messages'

export const draftForm: Form = buildForm({
  id: 'draftForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [RentalHousingSection, RentalPeriodSection, overviewSection],
})
