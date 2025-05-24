import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
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
    buildSection({
      title: m.requirements.approval.sectionTitle,
      children: [],
    }),
    draftSection,
    publishingSection,
    previewSection,
    confirmationSection,
  ],
})
