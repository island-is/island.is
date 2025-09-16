import { buildForm } from '@island.is/application/core'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { externalDataSection } from './externalData.section'
import { dataHandlingSection } from './dataHandling.section'

export const Prerequisites = buildForm({
  id: 'disabilityPensionPrerequisites',
  title: m.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataHandlingSection, externalDataSection],
})
