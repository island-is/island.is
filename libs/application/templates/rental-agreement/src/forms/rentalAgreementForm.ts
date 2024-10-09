import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import { RentalHousingInfo } from './RentalHousingInfo'
import { RentalPeriod } from './rentalPeriod'
import { Summary } from './summary'
import { Signing } from './signing'

import * as m from '../lib/messages'

export const RentalAgreementForm: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [RentalHousingInfo, RentalPeriod, Summary, Signing],
})
