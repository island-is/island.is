import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { intro } from './intro'
import { externalData } from './externalData'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.prerequisites.intro.sectionTitle,
  logo: HmsLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [intro, externalData],
})
