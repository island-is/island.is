import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { conclusionSection } from './conclusionSection'

export const Conclusion: Form = buildForm({
  id: 'MachineLicenseCardReissueConclusionForm',
  logo: AoshLogo,
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
