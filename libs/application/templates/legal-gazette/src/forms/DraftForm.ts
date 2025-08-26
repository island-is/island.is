import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { draftSection } from './sections/draftSection'
import { publishingSection } from './sections/publishingSection'
import { confirmationSection } from './sections/confirmationSection'
import { previewSection } from './sections/previewSection'

export const DraftForm: Form = buildForm({
  id: 'DraftForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    draftSection,
    publishingSection,
    previewSection,
    confirmationSection,
  ],
})
