import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { conclusionSection } from './WorkAccidentNotificationForm/ConclusionSection'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  logo: AoshLogo,
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
