import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  additionsAndDocuments,
  newCase,
  originalData,
  prerequisites,
  preview,
  publishingPrefrences,
} from '../lib/messages'
import { CompleteSection } from './sections'
export const Complete: Form = buildForm({
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
    buildSection({
      id: 'NewCase',
      title: newCase.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'AdditionsAndDocuments',
      title: additionsAndDocuments.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'Preview',
      title: preview.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'OriginalData',
      title: originalData.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'PublicationPreferences',
      title: publishingPrefrences.general.sectionTitle,
      children: [],
    }),
    CompleteSection,
  ],
})
