import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { application } from '../../lib/messages'
import Logo from '../../assets/Logo'
import { dataHandlingSection } from './dataHandlingSection'
import { externalDataSection } from './externalDataSection'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: application.general.name,
  logo: Logo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataHandlingSection, externalDataSection],
})
