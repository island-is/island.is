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
  attachments,
  general,
  advert,
  original,
  requirements,
  preview,
  publishing,
  summary,
} from '../lib/messages'
export const Requirements: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: Routes.REQUIREMENTS,
      title: requirements.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.REQUIREMENTS,
          title: '',
          children: [
            buildCustomField({
              id: 'requirements',
              title: '',
              component: 'RequirementsScreen',
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
      id: Routes.ADVERT,
      title: advert.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.ATTACHMENTS,
      title: attachments.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.ORIGINAL,
      title: original.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.PUBLISHING,
      title: publishing.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.sectionTitle,
      children: [],
    }),
  ],
})
