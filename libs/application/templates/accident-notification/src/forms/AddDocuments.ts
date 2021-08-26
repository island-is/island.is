import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  DefaultEvents,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { UPLOAD_ACCEPT, YES } from '../constants'
import { addDocuments, overview } from '../lib/messages'
import { WhoIsTheNotificationForEnum } from '../types'

export const AddDocuments: Form = buildForm({
  id: 'ParentalLeaveAddDocuments',
  title: addDocuments.general.sectionTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: addDocuments.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'attachments.multifield',
          title: addDocuments.general.heading,
          description: addDocuments.general.description,
          children: [
            buildFileUploadField({
              id: 'attachments.injuryCertificateFile',
              title: addDocuments.general.uploadTitle,
              introduction: addDocuments.injuryCertificate.uploadIntroduction,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: addDocuments.injuryCertificate.uploadHeader,
              uploadDescription: addDocuments.general.uploadDescription,
              uploadButtonLabel: addDocuments.general.uploadButtonLabel,
            }),
            buildFileUploadField({
              id: 'attachments.deathCertificateFile',
              title: addDocuments.general.uploadTitle,
              condition: (formValue) => formValue.wasTheAccidentFatal === YES,
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
                formValue.whoIsTheNotificationFor ===
                WhoIsTheNotificationForEnum.POWEROFATTORNEY,
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
              component: 'FormOverview',
            }),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
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
    }),
  ],
})
