import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusionSection } from './conclusionSection'
import { m } from '../../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: m.applicationAccept,
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
