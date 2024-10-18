import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { prerequisitesSection } from './prerequsitesSection'
import Logo from 'libs/application/templates/inao/shared/components/Logo'
import { m } from '../../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: () => Logo({ serviceProvider: m.serviceProvider, inao: m.inao }),
  children: [prerequisitesSection],
})
