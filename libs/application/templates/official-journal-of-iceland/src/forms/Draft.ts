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
  publishingPrefrences,
  summary,
} from '../lib/messages'
export const Draft: Form = buildForm({
  id: 'OfficalJournalOfIcelandApplication',
  title: general.applicationName,
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
      children: [
        buildCustomField({
          id: Routes.NEW_CASE,
          title: '',
          component: 'NewCase',
        }),
      ],
    }),
    buildSection({
      id: Routes.ADDITIONS_AND_DOCUMENTS,
      title: additionsAndDocuments.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.ADDITIONS_AND_DOCUMENTS,
          title: '',
          component: 'AdditionsAndDocuments',
        }),
      ],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'Preview',
          title: '',
          component: 'Preview',
        }),
      ],
    }),
    buildSection({
      id: Routes.ORIGINAL_DATA,
      title: originalData.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'originalData',
          title: '',
          component: 'OriginalData',
        }),
      ],
    }),
    buildSection({
      id: Routes.PUBLISHING_PREFRENCES,
      title: publishingPrefrences.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'PublishingPreferencesField',
          title: '',
          children: [
            buildCustomField({
              id: 'PublishingPrefrences',
              title: '',
              component: 'PublishingPrefrences',
            }),
            buildSubmitField({
              id: 'submit',
              title: general.continue,
              placement: 'footer',
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
      ],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.sectionTitle,
      children: [],
    }),
  ],
})
