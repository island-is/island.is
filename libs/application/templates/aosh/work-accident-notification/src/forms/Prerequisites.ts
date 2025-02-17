import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { prerequisitesSection } from './WorkAccidentNotificationForm/prerequisitesSection'
import { Logo } from '../assets/Logo'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [prerequisitesSection],
})
