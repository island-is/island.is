import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { RentalHousingInfo } from './RentalHousingInfo'
import { RentalPeriod } from './rentalPeriod'
import { Summary } from './summary/summary'

import { application } from '../lib/messages'

export const RentalAgreementForm: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: application.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [RentalHousingInfo, RentalPeriod, Summary],
})
