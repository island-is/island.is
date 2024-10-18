import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusionSection } from './conclusionSection'
import { m } from '../../lib/messages'
import Logo from '../../../../shared/components/Logo'

export const done: Form = buildForm({
  id: 'done',
  title: m.applicationAccept,
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
