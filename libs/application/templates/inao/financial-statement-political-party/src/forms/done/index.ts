import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusionSection } from './conclusionSection'
import { Logo } from '@island.is/application/templates/inao/shared'
import { m } from '../../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
