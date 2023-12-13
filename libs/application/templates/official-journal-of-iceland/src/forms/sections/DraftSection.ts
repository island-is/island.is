import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { AdditionsAndDocumentsField } from './fields/draft/AdditionsAndDocuments'
import { NewCaseField } from './fields/draft/NewCase'

export const DraftSection: Section[] = [
  buildSection({
    id: 'NewCase',
    title: m.basicInformationSectionTitle,
    children: [NewCaseField],
  }),
  buildSection({
    id: 'AdditionsAndDocuments',
    title: m.additionsAndDocumentsSectionTitle,
    children: [AdditionsAndDocumentsField],
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
    title: m.publicationPreferencesSectionTitle,
    children: [],
  }),
]
