import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { intro } from './intro'
import { externalData } from './externalData'
import Logo from '../../assets/Logo'
import * as m from '../../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.prerequisites.intro.sectionTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [intro, externalData],
})
