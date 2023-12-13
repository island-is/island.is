import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { AdditionsAndDocumentsField } from './fields/draft/AdditionsAndDocuments'
import { NewCaseField } from './fields/draft/NewCase'
import { OriginalDataField } from './fields/draft/OriginalData'
import { PreviewField } from './fields/draft/Preview'
import { PublishingPreferencesField } from './fields/draft/PublishingPrefrences'

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
    children: [PreviewField],
  }),
  buildSection({
    id: 'OriginalData',
    title: m.originalDataSectionTitle,
    children: [OriginalDataField],
  }),
  buildSection({
    id: 'PublicationPreferences',
    title: m.publishingPreferencesSectionTitle,
    children: [PublishingPreferencesField],
  }),
]
