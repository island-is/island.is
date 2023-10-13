import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildFileUploadField,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import { Citizenship } from '../../../lib/dataSchema'
import {
  getSelectedIndividualAge,
  getSelectedIndividualName,
  getSelectedCustodyChildren,
} from '../../../utils'
import { Routes } from '../../../lib/constants'

const FILE_SIZE_LIMIT = 10000000

export const ChildrenOtherDocumentsSubSection = (index: number) =>
  buildSubSection({
    id: Routes.CHILDSUPPORTINGDOCUMENTS,
    title: supportingDocuments.labels.otherDocuments.subSectionTitle,
    children: [
      buildMultiField({
        id: Routes.CHILDSUPPORTINGDOCUMENTS,
        title: supportingDocuments.labels.otherDocuments.pageTitle,
        description: (application: Application) => {
          return {
            ...supportingDocuments.general.description,
            values: {
              person:
                getSelectedIndividualName(
                  application.externalData,
                  application.answers,
                  index,
                ) || '',
            },
          }
        },
        children: [
          buildDescriptionField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].title`,
            title: supportingDocuments.labels.otherDocuments.title,
            titleVariant: 'h5',
          }),
          buildCustomField(
            {
              id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].nationalId`,
              title: '',
              component: 'HiddenTextInput',
            },
            {
              index: index,
            },
          ),
          buildFileUploadField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].birthCertificate`,
            title:
              supportingDocuments.labels.otherDocumentsChildren
                .birthCertificate,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.otherDocumentsChildren
                .birthCertificate,
            uploadDescription:
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            uploadButtonLabel:
              supportingDocuments.labels.otherDocuments.buttonText,
          }),
          buildFileUploadField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].writtenConsentFromChild`,
            title:
              supportingDocuments.labels.otherDocumentsChildren.writtenConsent,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.otherDocumentsChildren.writtenConsent,
            uploadDescription:
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            uploadButtonLabel:
              supportingDocuments.labels.otherDocuments.buttonText,
            condition: (formValue: FormValue, externalData) => {
              const age = getSelectedIndividualAge(
                externalData,
                formValue,
                index,
              )

              return !!age && age >= 12
            },
          }),
          buildFileUploadField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].writtenConsentFromOtherParent`,
            title:
              supportingDocuments.labels.otherDocumentsChildren
                .otherParentConsent,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.otherDocumentsChildren
                .otherParentConsent,
            uploadDescription:
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            uploadButtonLabel:
              supportingDocuments.labels.otherDocuments.buttonText,
            condition: (formValue: FormValue, externalData) => {
              const answers = formValue as Citizenship
              const selectedInCustody = getSelectedCustodyChildren(
                externalData,
                answers,
              )
              const thisChild =
                !!selectedInCustody &&
                selectedInCustody.find((_, i) => i === index - 1)

              const hasOtherParent =
                thisChild && !!thisChild.otherParent ? true : false

              return hasOtherParent
            },
          }),
          buildFileUploadField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].custodyDocuments`,
            title:
              supportingDocuments.labels.otherDocumentsChildren
                .custodyDocuments,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.otherDocumentsChildren
                .custodyDocuments,
            uploadDescription:
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            uploadButtonLabel:
              supportingDocuments.labels.otherDocuments.buttonText,
            condition: (formValue: FormValue, externalData) => {
              const answers = formValue as Citizenship
              const selectedInCustody = getSelectedCustodyChildren(
                externalData,
                answers,
              )
              const thisChild =
                !!selectedInCustody &&
                selectedInCustody.find((_, i) => i === index - 1)
              const hasOtherParent =
                thisChild && !!thisChild.otherParent ? true : false

              return hasOtherParent
            },
          }),
        ],
      }),
    ],
  })
