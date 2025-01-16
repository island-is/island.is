import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../../components/Logo'
import { prerequisitesSection } from './prerequsitesSection'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: Logo,
  children: [prerequisitesSection],
})
