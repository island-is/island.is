import {
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  DefaultEvents,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { States, UPLOAD_ACCEPT } from '../constants'
import {
  addDocuments,
  inReview,
  overview,
  thirdPartyComment,
} from '../lib/messages'
import {
  hasMissingDeathCertificate,
  hasMissingInjuryCertificate,
  hasMissingPowerOfAttorneyFile,
} from '../utils'

export const AssigneeInReview: Form = buildForm({
  id: 'AssigneeInReview',
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
        buildCustomField(
          {
            id: 'InReviewSteps.one',
            title: (application) =>
              application.state === States.APPROVED
                ? inReview.general.titleApproved
                : inReview.general.titleInReview,
            component: 'InReviewSteps',
          },
          {
            isAssignee: true,
          },
        ),
      ],
    }),
    buildSection({
      id: 'overview.section',
      title: overview.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'overview.multifield',
          title: overview.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'overview',
              title: overview.general.sectionTitle,
              component: 'ThirdPartyFormOverview',
            }),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: thirdPartyComment.buttons.reject,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: thirdPartyComment.buttons.approve,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'review',
      title: '',
      condition: (formValue) => {
        console.log(
          'add condition so that user wont see this unless after clicking the button in review or overview',
        )
        return true
      },
      children: [
        buildMultiField({
          id: 'attachments.multifield',
          title: addDocuments.general.heading,
          description: addDocuments.general.description,
          children: [
            buildFileUploadField({
              id: 'attachments.injuryCertificateFile',
              title: addDocuments.general.uploadTitle,
              condition: (formValue) => hasMissingInjuryCertificate(formValue),
              introduction: addDocuments.injuryCertificate.uploadIntroduction,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: addDocuments.injuryCertificate.uploadHeader,
              uploadDescription: addDocuments.general.uploadDescription,
              uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            }),
            buildFileUploadField({
              id: 'attachments.deathCertificateFile',
              title: addDocuments.general.uploadTitle,
              condition: (formValue) => hasMissingDeathCertificate(formValue),
              introduction: addDocuments.deathCertificate.uploadIntroduction,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: addDocuments.deathCertificate.uploadHeader,
              uploadDescription: addDocuments.general.uploadDescription,
              uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            }),
            buildFileUploadField({
              id: 'attachments.powerOfAttorneyFile',
              title: addDocuments.general.uploadTitle,
              condition: (formValue) =>
                hasMissingPowerOfAttorneyFile(formValue),
              introduction: addDocuments.powerOfAttorney.uploadIntroduction,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: addDocuments.powerOfAttorney.uploadHeader,
              uploadDescription: addDocuments.general.uploadDescription,
              uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            }),
          ],
        }),
      ],
    }),
  ],
})
