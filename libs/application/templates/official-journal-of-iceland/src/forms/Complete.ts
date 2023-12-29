import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildRedirectToServicePortalField,
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
  publishingPreferences,
  summary,
} from '../lib/messages'
export const Complete: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: 'Skilyrði',
  mode: FormModes.COMPLETED,
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
      id: Routes.PUBLISHING_PREFERENCES,
      title: publishingPreferences.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.COMPLETE,
      title: summary.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'summary',
          title: '',
          children: [
            buildCustomField({
              id: Routes.COMPLETE,
              title: '',
              component: 'Complete',
            }),
          ],
        }),
      ],
    }),
  ],
})
