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
      id: Routes.COMPLETE,
      title: summary.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'complete',
          title: '',
          children: [
            buildCustomField({
              id: 'complete',
              title: '',
              component: 'CompleteScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})
