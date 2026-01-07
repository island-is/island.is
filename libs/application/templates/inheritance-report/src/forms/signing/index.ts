import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { signatoryStatusSection } from './signatoryStatusSection'

export const signingForm: Form = buildForm({
  id: 'signingForm',
  title: m.signingTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [signatoryStatusSection],
})

