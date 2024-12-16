import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { application } from '../../lib/messages'
import Logo from '../../assets/Logo'
import { dataHandlingSection } from '../PrerequisitesForm/dataHandlingSection'
import { externalDataSection } from './externalDataSection'

export const PrerequisitesProcureForm: Form = buildForm({
  id: 'PrerequisitesProcureForm',
  title: application.general.name,
  logo: Logo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataHandlingSection, externalDataSection],
})
