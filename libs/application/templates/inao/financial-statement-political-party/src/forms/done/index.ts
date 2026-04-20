import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusionSection } from '../applicationForm/conclusionSection'
import { InaoLogo } from '@island.is/application/assets/institution-logos'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.COMPLETED,
  logo: InaoLogo,
  children: [conclusionSection],
})
