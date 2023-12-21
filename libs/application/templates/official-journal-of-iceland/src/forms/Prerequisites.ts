import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import {
  additionsAndDocuments,
  newCase,
  originalData,
  preview,
  publishingPrefrences,
  summary,
} from '../lib/messages'
import { PrerequisitesSection } from './sections'
export const Prerequsites: Form = buildForm({
  id: 'OfficalJournalOfIcelandPreRequsitesForm',
  title: 'Skilyrði',
  mode: FormModes.DRAFT,
  children: [
    PrerequisitesSection,
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
    buildSection({
      id: 'Summary',
      title: summary.general.sectionTitle,
      children: [],
    }),
  ],
})
