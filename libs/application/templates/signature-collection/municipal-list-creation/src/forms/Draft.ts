import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import { information } from './sections/information'
import { overview } from './sections/overview'
import { confirmation } from './sections/confirmation'
import Logo from '@island.is/application/templates/signature-collection/assets/Logo'

export const Draft: Form = buildForm({
  id: 'municipalListCreationDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
  children: [information, overview, confirmation],
})
