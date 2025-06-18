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
export const Draft: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.IN_PROGRESS,
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
      children: [
        buildCustomField({
          id: 'advert',
          component: 'AdvertScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.ATTACHMENTS,
      title: attachments.general.section,
      children: [
        buildCustomField({
          id: 'attachments',
          component: 'AttachmentsScreen',
        }),
        buildCustomField({
          id: 'supportingDocument',
          component: 'SupportingDocScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.section,
      children: [
        buildCustomField({
          id: 'preview',
          component: 'PreviewScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.ORIGINAL,
      title: original.general.section,
      children: [
        buildCustomField({
          id: 'original',
          component: 'OriginalScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.PUBLISHING,
      title: publishing.general.section,
      children: [
        buildCustomField({
          id: 'publishing',
          component: 'PublishingScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.section,
      children: [
        buildMultiField({
          id: Routes.SUMMARY,
          children: [
            buildCustomField({
              id: Routes.SUMMARY,
              component: 'SummaryScreen',
            }),
            buildSubmitField({
              id: 'toComplete',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: general.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
