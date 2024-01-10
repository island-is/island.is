import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Routes, UPLOAD_ACCEPT } from '../lib/constants'
import {
  additionsAndDocuments,
  general,
  newCase,
  originalData,
  prerequisites,
  preview,
  publishingPreferences,
  summary,
} from '../lib/messages'
import { InputFields } from '../lib/types'
import { answerSchemas } from '../lib/dataSchema'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
export const Draft: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: Routes.PREREQUISITES,
      title: prerequisites.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: Routes.NEW_CASE,
      title: newCase.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'case',
          title: '',
          component: 'NewCase',
        }),
      ],
    }),
    buildSection({
      id: Routes.ADDITIONS_AND_DOCUMENTS,
      title: additionsAndDocuments.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.ADDITIONS_AND_DOCUMENTS,
          title: '',
          space: 2,
          children: [
            buildDescriptionField({
              id: Routes.ADDITIONS_AND_DOCUMENTS,
              title: additionsAndDocuments.general.formTitle,
              description: additionsAndDocuments.general.formIntro,
            }),
            buildFileUploadField({
              id: InputFields.additionsAndDocuments.files,
              title: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: additionsAndDocuments.fileUpload.header,
              uploadDescription: additionsAndDocuments.fileUpload.description,
              uploadButtonLabel: additionsAndDocuments.fileUpload.buttonLabel,
            }),
            buildRadioField({
              id: InputFields.additionsAndDocuments.fileNames,
              title: additionsAndDocuments.nameOfDocumentsChapter.title,
              largeButtons: false,
              options: [
                {
                  value: 'documents',
                  label: additionsAndDocuments.radio.documents.label,
                },
                {
                  value: 'additions',
                  label: additionsAndDocuments.radio.additions.label,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'preview',
          title: '',
          component: 'Preview',
        }),
      ],
    }),
    buildSection({
      id: Routes.ORIGINAL_DATA,
      title: originalData.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.ORIGINAL_DATA,
          title: '',
          space: 2,
          children: [
            buildDescriptionField({
              id: Routes.ORIGINAL_DATA,
              title: originalData.general.formTitle,
              description: originalData.general.formIntro,
            }),
            buildFileUploadField({
              id: InputFields.originalData.files,
              title: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadMultiple: false,
              uploadHeader: originalData.fileUpload.header,
              uploadDescription: originalData.fileUpload.description,
              uploadButtonLabel: originalData.fileUpload.buttonLabel,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: Routes.PUBLISHING_PREFERENCES,
      title: publishingPreferences.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'publishingPreferences',
          title: '',
          component: 'PublishingPreferences',
        }),
      ],
    }),
    // Some of the values below will be provided through external data api that is not impletment yet
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.SUMMARY,
          title: '',
          children: [
            buildDescriptionField({
              id: 'summary',
              title: summary.general.formTitle,
              description: summary.general.formIntro,
              marginBottom: 2,
            }),
            buildKeyValueField({
              display: 'flex',
              label: summary.properties.sender,
              divider: true,
              paddingY: 3,
              paddingX: 4,
              value: (application) => application.applicant, // replace this with the correct value
            }),
            buildKeyValueField({
              display: 'flex',
              label: summary.properties.title,
              divider: true,
              paddingY: 3,
              paddingX: 4,
              value: ({ answers }) => (answers as answerSchemas).case.title,
            }),
            buildKeyValueField({
              display: 'flex',
              label: summary.properties.department,
              divider: true,
              paddingY: 3,
              paddingX: 4,
              value: ({ answers }) =>
                (answers as answerSchemas).case.department,
            }),
            buildKeyValueField({
              display: 'flex',
              label: summary.properties.submissionDate,
              divider: true,
              paddingY: 3,
              paddingX: 4,
              value: format(new Date(), 'dd.MM.yyyy'),
            }),
            // buildKeyValueField({
            //   display: 'flex',
            //   label: summary.properties.fastTrack,
            //   divider: true,
            //   paddingY: 3,
            //   paddingX: 4,
            //   value: ({ answers }) => {
            //     console.log(answers)
            //     return (answers as answerSchemas).publishingPreferences
            //       .fastTrack === AnswerOption.YES
            //       ? general.yes
            //       : general.no
            //   },
            // }),
            buildKeyValueField({
              display: 'flex',
              label: summary.properties.fastTrack,
              divider: true,
              paddingY: 3,
              paddingX: 4,
              value: format(addDays(new Date(), 90), 'dd.MM.yyyy'),
            }),
            buildKeyValueField({
              display: 'flex',
              label: summary.properties.estimatedPrice,
              divider: true,
              paddingY: 3,
              paddingX: 4,
              value: '23.000',
            }),
            buildKeyValueField({
              display: 'flex',
              label: summary.properties.classification,
              divider: true,
              paddingY: 3,
              paddingX: 4,
              value: 'Verkföll og vinnudeilur',
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
