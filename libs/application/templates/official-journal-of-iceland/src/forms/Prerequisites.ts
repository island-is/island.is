import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
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
export const Prerequsites: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: Routes.PREREQUISITES,
      title: prerequisites.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.PREREQUISITES,
          title: '',
          children: [
            buildCustomField({
              id: 'prerequisites',
              title: '',
              component: 'Prerequisites',
            }),
            buildSubmitField({
              id: 'toDraft',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: general.continue,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // This is here to be able to show submit button on former screen :( :( :(
        buildMultiField({
          id: '',
          title: '',
          children: [],
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
      id: Routes.PUBLISHING_PREFERENCES,
      title: publishingPreferences.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.sectionTitle,
      children: [],
    }),
  ],
})
