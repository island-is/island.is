import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildFileUploadField,
  getValueViaPath,
  buildHiddenInput,
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
import { FILE_TYPES_ALLOWED, MIN_AGE_WRITTEN_CONSENT } from '../../../shared'

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
            description: supportingDocuments.labels.otherDocuments.title,
            titleVariant: 'h5',
            title: '',
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
            uploadAccept: FILE_TYPES_ALLOWED,
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.otherDocumentsChildren
                .birthCertificate,
            uploadDescription:
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            uploadButtonLabel:
              supportingDocuments.labels.otherDocuments.buttonText,
          }),
          buildHiddenInput({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].writtenConsentFromChildRequired`,
            defaultValue: (application: Application) => {
              const age = getSelectedIndividualAge(
                application.externalData,
                application.answers,
                index,
              )

              return !!age && age >= MIN_AGE_WRITTEN_CONSENT ? 'true' : 'false'
            },
          }),
          buildFileUploadField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].writtenConsentFromChild`,
            title:
              supportingDocuments.labels.otherDocumentsChildren.writtenConsent,
            introduction: '',
            uploadAccept: FILE_TYPES_ALLOWED,
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

              return !!age && age >= MIN_AGE_WRITTEN_CONSENT
            },
          }),
          buildHiddenInput({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].writtenConsentFromOtherParentRequired`,
            defaultValue: (application: Application) => {
              const answers = application.answers as Citizenship
              const selectedInCustody = getSelectedCustodyChildren(
                application.externalData,
                answers,
              )
              const thisChild =
                !!selectedInCustody &&
                selectedInCustody.find((_, i) => i === index - 1)

              const hasOtherParent =
                thisChild && !!thisChild.otherParent ? true : false

              const customAddedParent = getValueViaPath(
                answers,
                `selectedChildrenExtraData[${index}].otherParentName`,
                '',
              ) as string

              return hasOtherParent || !!customAddedParent ? 'true' : 'false'
            },
          }),
          buildFileUploadField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].writtenConsentFromOtherParent`,
            title:
              supportingDocuments.labels.otherDocumentsChildren
                .otherParentConsent,
            introduction: '',
            uploadAccept: FILE_TYPES_ALLOWED,
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

              const customAddedParent = getValueViaPath(
                answers,
                `selectedChildrenExtraData[${index}].otherParentName`,
                '',
              ) as string

              return hasOtherParent || !!customAddedParent
            },
          }),
          buildHiddenInput({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].custodyDocumentsRequired`,
            defaultValue: (application: Application) => {
              const answers = application.answers as Citizenship
              const selectedInCustody = getSelectedCustodyChildren(
                application.externalData,
                answers,
              )
              const thisChild =
                !!selectedInCustody &&
                selectedInCustody.find((_, i) => i === index - 1)
              const hasOtherParent =
                thisChild && !!thisChild.otherParent ? true : false

              return hasOtherParent ? 'true' : 'false'
            },
          }),
          buildFileUploadField({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].custodyDocuments`,
            title:
              supportingDocuments.labels.otherDocumentsChildren
                .custodyDocuments,
            introduction: '',
            uploadAccept: FILE_TYPES_ALLOWED,
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
