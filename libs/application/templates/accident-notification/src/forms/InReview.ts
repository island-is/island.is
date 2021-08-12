import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { States } from '../constants'
import { inReview } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: (application) =>
        application.state === States.APPROVED
          ? inReview.general.titleApproved
          : inReview.general.titleInReview,
      children: [
        buildCustomField({
          id: 'InReviewSteps.one',
          title: (application) =>
            application.state === States.APPROVED
              ? inReview.general.titleApproved
              : inReview.general.titleInReview,
          component: 'InReviewSteps',
        }),
        /* buildCustomField({
          id: 'overview',
          title: overview.general.sectionTitle,
          component: 'FormOverview',
        }),
        buildMultiField({
          id: 'attachments.injuryCertificateFile.section',
          title: attachments.general.uploadTitle,
          children: [
            buildFileUploadField({
              id: 'attachments.injuryCertificateFile',
              title: attachments.general.uploadHeader,
              uploadHeader: attachments.general.uploadHeader,
              uploadDescription: attachments.general.uploadDescription,
              uploadButtonLabel: attachments.general.uploadButtonLabel,
              introduction: attachments.general.uploadIntroduction,
            }),
          ],
          condition: (formValue) =>
            (formValue as {
              attachments: { injuryCertificate: AttachmentsEnum }
            }).attachments?.injuryCertificate ===
            AttachmentsEnum.INJURYCERTIFICATE,
        }),
        buildCustomField({
          id: 'overview',
          title: overview.general.sectionTitle,
          component: 'FormOverview',
        }),
        buildCustomField({
          id: 'InReviewSteps.two',
          title: (application) =>
            application.state === States.APPROVED
              ? inReview.general.titleApproved
              : inReview.general.titleInReview,
          component: 'InReviewSteps',
        }), */
      ],
    }),
  ],
})
