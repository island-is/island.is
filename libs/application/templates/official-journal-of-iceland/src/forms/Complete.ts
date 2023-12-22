import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Routes } from '../lib/constants'
import {
  additionsAndDocuments,
  newCase,
  originalData,
  prerequisites,
  preview,
  publishingPrefrences,
  summary,
} from '../lib/messages'
export const Complete: Form = buildForm({
  id: 'OfficalJournalOfIcelandPreRequsitesForm',
  title: 'Skilyrði',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: Routes.PREREQUISITES,
      title: prerequisites.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.NEW_CASE,
      title: newCase.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.ADDITIONS_AND_DOCUMENTS,
      title: additionsAndDocuments.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.ORIGINAL_DATA,
      title: originalData.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.PUBLISHING_PREFRENCES,
      title: publishingPrefrences.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SUMMARY,
          title: '',
          component: 'Summary',
        }),
        buildCustomField({
          id: Routes.COMPLETE,
          title: '',
          component: 'Complete',
        }),
      ],
    }),
  ],
})
