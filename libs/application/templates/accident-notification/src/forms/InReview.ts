import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { inReview } from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'InReview',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        buildCustomField({
          id: 'ReviewForm',
          title: '',
          component: 'ReviewForm',
        }),
      ],
    }),
    /* buildSection({
      id: 'attachments',
      title: '',
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
            buildFileUploadField({
              id: 'attachments.additionalFiles',
              title: addDocuments.general.uploadTitle,
              introduction: addDocuments.general.uploadIntroduction,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: addDocuments.general.uploadHeader,
              uploadDescription: addDocuments.general.uploadDescription,
              uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: '',
      children: [
        buildMultiField({
          id: 'overview.multifield',
          title: overview.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'overview.custom',
              title: overview.general.sectionTitle,
              component: 'FormOverview',
            }),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.labels.update,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // This is so that the submit field appears
        buildDescriptionField({
          id: 'temp',
          title: 'temp',
          description: 'temp',
        }),
      ],
    }), */
  ],
})
