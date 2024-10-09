import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import * as m from '../lib/messages'
import { prerequisitesIntro } from './prerequisites/intro'
import { externalData } from './prerequisites/externalData'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.prerequisites.intro.sectionTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: false,
  children: [prerequisitesIntro, externalData],
})
