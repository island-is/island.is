import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import * as m from '../lib/messages'
import { intro } from './prerequisites/intro'
import { externalData } from './prerequisites/externalData'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.prerequisites.intro.sectionTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [intro, externalData],
})
