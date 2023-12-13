import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { PrerequisitesSection } from './sections'
export const Prerequsites: Form = buildForm({
  id: 'OfficalJournalOfIcelandPreRequsitesForm',
  title: 'Skilyrði',
  mode: FormModes.DRAFT,
  children: [
    PrerequisitesSection,
    buildSection({
      id: 'NewCase',
      title: m.newCaseSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'AdditionsAndDocuments',
      title: m.additionsAndDocumentsSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'Preview',
      title: m.previewSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'OriginalData',
      title: m.originalDataSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'PublicationPreferences',
      title: m.publishingPreferencesSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'Summary',
      title: m.summarySectionTitle,
      children: [],
    }),
  ],
})
