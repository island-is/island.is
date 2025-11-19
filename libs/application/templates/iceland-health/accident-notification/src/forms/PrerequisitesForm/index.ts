import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { application } from '../../lib/messages'
import { dataHandlingSection } from './dataHandlingSection'
import { externalDataSection } from './externalDataSection'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: application.general.name,
  logo: IcelandHealthLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataHandlingSection, externalDataSection],
})
