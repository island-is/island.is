import { buildForm, buildSection } from '@island.is/application/core'
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
import { complete } from '../lib/messages/complete'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
export const Complete: Form = buildForm({
  id: 'OfficialJournalOfIcelandAdvertOfIcelandApplication',
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
    buildFormConclusionSection({
      multiFieldTitle: complete.general.title,
      expandableDescription: complete.general.bullets,
    }),
  ],
})
