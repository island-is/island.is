import {
  buildCustomField,
  // TODO: Uncomment when data providers are implemented
  // buildDataProviderItem,
  // buildExternalDataProvider,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'

import {
  Form,
  FormModes,
  // TODO: Uncomment when data providers are implemented
  // NationalRegistryUserApi,
  // UserProfileApi,
} from '@island.is/application/types'
import * as m from '../lib/messages'

import { Prerequisites } from './Prerequisites'
import { RentalHousingInfo } from './RentalHousingInfo'
import { RentalPeriod } from './rentalPeriod'
import { Summary } from './summary'
import { Signing } from './signing'

export const RentalAgreementForm: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  children: [Prerequisites, RentalHousingInfo, RentalPeriod, Summary, Signing],
})
