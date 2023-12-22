import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Routes } from '../lib/constants'
import {
  additionsAndDocuments,
  general,
  newCase,
  originalData,
  prerequisites,
  preview,
  publishingPrefrences,
  summary,
} from '../lib/messages'
export const Prerequsites: Form = buildForm({
  id: 'OfficalJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: Routes.PREREQUISITES,
      title: prerequisites.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'prerequisites',
          title: '',
          component: 'Prerequisites',
        }),
      ],
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
      children: [],
    }),
  ],
})
