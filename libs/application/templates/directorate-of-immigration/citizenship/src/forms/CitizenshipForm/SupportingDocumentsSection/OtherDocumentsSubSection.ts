import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildFileUploadField,
  YES,
  getValueViaPath,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'
import {
  Answer,
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'
import { Routes } from '../../../lib/constants'
import { FILE_SIZE_LIMIT } from '../../../shared'

export const OtherDocumentsSubSection = buildSubSection({
  id: Routes.SUPPORTINGDOCUMENTS,
  title: supportingDocuments.labels.otherDocuments.subSectionTitle,
  children: [
    // multi field for applicant
    buildMultiField({
      id: Routes.SUPPORTINGDOCUMENTS,
      title: supportingDocuments.labels.otherDocuments.pageTitle,
      description: (application: Application) => {
        const applicant = getValueViaPath(
          application.externalData,
          'individual.data',
          '',
        ) as NationalRegistryIndividual | undefined

        return {
          ...supportingDocuments.general.description,
          values: {
            person: `${applicant?.givenName} ${applicant?.familyName}`,
          },
        }
      },
      children: [
        buildDescriptionField({
          id: `${Routes.SUPPORTINGDOCUMENTS}.title`,
          title: supportingDocuments.labels.otherDocuments.title,
          titleVariant: 'h5',
        }),

        buildFileUploadField({
          id: `${Routes.SUPPORTINGDOCUMENTS}.birthCertificate`,
          title: supportingDocuments.labels.otherDocuments.birthCertificate,
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          condition: (answer: Answer) => {
            const answers = answer as Citizenship
            if (answers?.parentInformation?.hasValidParents === YES) {
              return true
            }
            return false
          },
          uploadHeader:
            supportingDocuments.labels.otherDocuments.birthCertificate,
          uploadDescription:
            supportingDocuments.labels.otherDocuments.acceptedFileTypes,
          uploadButtonLabel:
            supportingDocuments.labels.otherDocuments.buttonText,
        }),

        buildFileUploadField({
          id: `${Routes.SUPPORTINGDOCUMENTS}.incomeConfirmation`,
          title: supportingDocuments.labels.otherDocuments.incomeConfirmation,
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader:
            supportingDocuments.labels.otherDocuments.incomeConfirmation,
          uploadDescription:
            supportingDocuments.labels.otherDocuments.acceptedFileTypes,
          uploadButtonLabel:
            supportingDocuments.labels.otherDocuments.buttonText,
        }),

        buildFileUploadField({
          id: `${Routes.SUPPORTINGDOCUMENTS}.incomeConfirmationTown`,
          title:
            supportingDocuments.labels.otherDocuments.incomeConfirmationTown,
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader:
            supportingDocuments.labels.otherDocuments.incomeConfirmationTown,
          uploadDescription:
            supportingDocuments.labels.otherDocuments.acceptedFileTypes,
          uploadButtonLabel:
            supportingDocuments.labels.otherDocuments.buttonText,
        }),

        buildFileUploadField({
          id: `${Routes.SUPPORTINGDOCUMENTS}.legalHome`,
          title: supportingDocuments.labels.otherDocuments.legalHome,
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader: supportingDocuments.labels.otherDocuments.legalHome,
          uploadDescription:
            supportingDocuments.labels.otherDocuments.acceptedFileTypes,
          uploadButtonLabel:
            supportingDocuments.labels.otherDocuments.buttonText,
        }),

        buildFileUploadField({
          id: `${Routes.SUPPORTINGDOCUMENTS}.icelandicTest`,
          title: supportingDocuments.labels.otherDocuments.icelandicTest,
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader: supportingDocuments.labels.otherDocuments.icelandicTest,
          uploadDescription:
            supportingDocuments.labels.otherDocuments.acceptedFileTypes,
          uploadButtonLabel:
            supportingDocuments.labels.otherDocuments.buttonText,
        }),

        buildCustomField({
          id: `${Routes.SUPPORTINGDOCUMENTS}.criminalRecord`,
          title: '',
          component: 'CriminalRecords',
        }),
      ],
    }),
  ],
})
