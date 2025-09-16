import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../../assets/Logo'
import { RentalHousingSection } from './rentalHousingSection'
import { RentalPeriodSection } from './rentalPeriodSection'
import { SummaryDraftSection } from './summaryDraftSection'

import { application } from '../../lib/messages'

export const draftForm: Form = buildForm({
  id: 'draftForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [RentalHousingSection, RentalPeriodSection, SummaryDraftSection],
})
