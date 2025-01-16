import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Routes } from '../lib/constants'
import {
  attachments,
  advert,
  original,
  requirements,
  preview,
  publishing,
} from '../lib/messages'
import { submitted } from '../lib/messages/submitted'
export const Submitted: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: Routes.REQUIREMENTS,
      title: requirements.general.section,
      children: [],
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
      id: Routes.COMPLETE,
      title: submitted.general.section,
      children: [
        buildMultiField({
          children: [
            buildCustomField({
              id: 'submitted',
              component: 'SubmittedScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})
