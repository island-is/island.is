import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { conclusionSection } from '../conclusionSection'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: AoshLogo,
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
