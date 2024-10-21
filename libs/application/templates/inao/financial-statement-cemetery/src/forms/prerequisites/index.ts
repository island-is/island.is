import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '@island.is/libs/application/templates/inao/shared/components/Logo'
import { prerequisitesSection } from './prerequsitesSection'
import { m } from '../../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  children: [prerequisitesSection],
})
