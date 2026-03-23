import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { InaoLogo } from '@island.is/application/assets/institution-logos'
import { prerequisitesSection } from './prerequisitesSection'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: InaoLogo,
  children: [prerequisitesSection],
})
