import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusionSection } from './conclusionSection'
import Logo from '@island.is/libs/application/templates/inao/shared/components/Logo'
import { m } from '../../lib/utils/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  mode: FormModes.COMPLETED,
  children: [conclusionSection],
})
