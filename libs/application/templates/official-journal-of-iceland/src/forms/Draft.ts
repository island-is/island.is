import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { DraftSection } from './sections'
export const Draft: Form = buildForm({
  id: 'OfficalJournalOfIcelandPreRequsitesForm',
  title: 'Skilyrði',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'ExternalData',
      title: m.prerequisitesSectionTitle,
      children: [],
    }),
    ...DraftSection,
    buildSection({
      id: 'Summary',
      title: m.summarySectionTitle,
      children: [],
    }),
  ],
})
