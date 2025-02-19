import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../assets/Logo'
import { conclusionSection } from './WorkAccidentNotificationForm/ConclusionSection'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
