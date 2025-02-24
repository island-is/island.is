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
  involvedParty,
} from '../lib/messages'
export const Requirements: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: Routes.REQUIREMENTS,
      title: requirements.general.section,
      children: [
        buildMultiField({
          id: Routes.REQUIREMENTS,
          children: [
            buildCustomField({
              id: 'requirements',
              component: 'RequirementsScreen',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: Routes.INVOLVED_PARTY,
      title: involvedParty.general.section,
      children: [
        buildMultiField({
          id: Routes.INVOLVED_PARTY,
          children: [
            buildCustomField({
              id: 'involvedParty',
              component: 'InvolvedPartyScreen',
            }),
            buildSubmitField({
              id: 'toComments',
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
          children: [],
        }),
      ],
    }),
    buildSection({
      id: Routes.ADVERT,
      title: advert.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.ATTACHMENTS,
      title: attachments.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.ORIGINAL,
      title: original.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.PUBLISHING,
      title: publishing.general.section,
      children: [],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.section,
      children: [],
    }),
  ],
})
