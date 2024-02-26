import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Routes, UPLOAD_ACCEPT } from '../lib/constants'
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
          title: '',
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
          title: '',
          component: 'AttachmentsScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.section,
      children: [
        buildCustomField({
          id: 'preview',
          title: '',
          component: 'PreviewScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.ORIGINAL,
      title: original.general.section,
      children: [
        buildMultiField({
          id: Routes.ORIGINAL,
          title: '',
          space: 2,
          children: [
            buildDescriptionField({
              id: Routes.ORIGINAL,
              title: original.general.title,
              description: original.general.intro,
            }),
            buildFileUploadField({
              id: 'InputFields.originalDocuments.files',
              title: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadMultiple: false,
              uploadHeader: original.fileUpload.header,
              uploadDescription: original.fileUpload.description,
              uploadButtonLabel: original.fileUpload.buttonLabel,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: Routes.PUBLISHING,
      title: publishing.general.section,
      children: [
        buildCustomField({
          id: 'publishing',
          title: '',
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
          title: '',
          children: [
            buildCustomField({
              id: Routes.SUMMARY,
              title: '',
              component: 'SummaryScreen',
            }),
            buildSubmitField({
              id: 'toComplete',
              title: '',
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
