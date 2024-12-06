import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { conclusionSection } from '../applicationForm/conclusionSection/conclusionSection'
import Logo from '../../components/Logo'

export const done: Form = buildForm({
  id: 'done',
  title: m.applicationAccept,
  mode: FormModes.COMPLETED,
  logo: Logo,
  children: [conclusionSection],
})
