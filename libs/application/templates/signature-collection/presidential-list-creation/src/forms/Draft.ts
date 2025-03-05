import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../../assets/Logo'
import { information } from './sections/information'
import { overview } from './sections/overview'

export const Draft: Form = buildForm({
  id: 'PresidentialListCreationDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
  children: [information, overview],
})
