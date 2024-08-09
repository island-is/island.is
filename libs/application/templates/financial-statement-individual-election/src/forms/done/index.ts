import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusionSection } from './conclusionSection'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
