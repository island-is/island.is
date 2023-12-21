import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { prerequisites, summary } from '../lib/messages'
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
      title: prerequisites.general.sectionTitle,
      children: [],
    }),
    ...DraftSection,
    buildSection({
      id: 'Summary',
      title: summary.general.sectionTitle,
      children: [],
    }),
  ],
})
