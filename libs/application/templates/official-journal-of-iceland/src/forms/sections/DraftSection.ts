import { buildSection } from '@island.is/application/core'
import { Section } from '@island.is/application/types'
import {
  additionsAndDocuments,
  newCase,
  originalData,
  publishingPrefrences,
} from '../../lib/messages'
import { preview } from '../../lib/messages/preview'
import { AdditionsAndDocumentsField } from './fields/draft/AdditionsAndDocuments'
import { NewCaseField } from './fields/draft/NewCase'
import { OriginalDataField } from './fields/draft/OriginalData'
import { PreviewField } from './fields/draft/Preview'
import { PublishingPreferencesField } from './fields/draft/PublishingPrefrences'

export const DraftSection: Section[] = [
  buildSection({
    id: 'NewCase',
    title: newCase.general.sectionTitle,
    children: [NewCaseField],
  }),
  buildSection({
    id: 'AdditionsAndDocuments',
    title: additionsAndDocuments.general.sectionTitle,
    children: [AdditionsAndDocumentsField],
  }),
  buildSection({
    id: 'Preview',
    title: preview.general.sectionTitle,
    children: [PreviewField],
  }),
  buildSection({
    id: 'OriginalData',
    title: originalData.general.sectionTitle,
    children: [OriginalDataField],
  }),
  buildSection({
    id: 'PublicationPreferences',
    title: publishingPrefrences.general.sectionTitle,
    children: [PublishingPreferencesField],
  }),
]
