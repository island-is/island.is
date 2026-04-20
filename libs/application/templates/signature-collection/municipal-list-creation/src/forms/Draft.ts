import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import { information } from './sections/information'
import { overview } from './sections/overview'
import { confirmation } from './sections/confirmation'
import { NationalElectoralCommissionLogo } from '@island.is/application/assets/institution-logos'

export const Draft: Form = buildForm({
  id: 'municipalListCreationDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: NationalElectoralCommissionLogo,
  children: [information, overview, confirmation],
})
