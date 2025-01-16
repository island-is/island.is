import {
  buildCustomField,
  buildForm,
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
import { rejected } from '../lib/messages'
export const Rejected: Form = buildForm({
  id: 'OfficialJournalOfIcelandAdvertOfIcelandApplication',
  title: 'Skilyrði',
  mode: FormModes.REJECTED,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
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
      id: Routes.REJECTED,
      title: rejected.general.section,
      children: [
        buildCustomField({
          id: 'rejected',
          component: 'RejectScreen',
        }),
      ],
    }),
  ],
})
