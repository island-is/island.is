import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildFileUploadField,
  getValueViaPath,
  buildHiddenInput,
  NO,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import {
  getSelectedCustodyChild,
  getSelectedIndividualAge,
  getSelectedIndividualName,
} from '../../../utils'
import { Routes } from '../../../lib/constants'
import { FILE_TYPES_ALLOWED, MIN_AGE_WRITTEN_CONSENT } from '../../../shared'
import { SelectedChild } from '../../../types/types'

const FILE_SIZE_LIMIT = 10000000

export const ChildrenOtherDocumentsSubSection = (index: number) =>
  buildSubSection({
    id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}]`,
    title: supportingDocuments.labels.otherDocuments.subSectionTitle,
    children: [
      buildMultiField({
        id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}]`,
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
          }),
          buildHiddenInput({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].nationalId`,
            defaultValue: (application: Application) => {
              const selectedChild = getSelectedCustodyChild(
                application.externalData,
                application.answers,
                index,
              )
              return selectedChild?.nationalId
            },
          }),
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
              const selectedChildrenExtraData =
                getValueViaPath<Array<SelectedChild>>(
                  application.answers,
                  'selectedChildrenExtraData',
                ) ?? []

              const hasFullCustody =
                selectedChildrenExtraData[index]?.hasFullCustody

              return hasFullCustody === NO ? 'true' : 'false'
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
            condition: (formValue: FormValue) => {
              const answers = formValue
              const selectedChildrenExtraData =
                getValueViaPath<Array<SelectedChild>>(
                  answers,
                  'selectedChildrenExtraData',
                ) ?? []
              const hasFullCustody =
                selectedChildrenExtraData[index]?.hasFullCustody

              return hasFullCustody === NO
            },
          }),
          buildHiddenInput({
            id: `${Routes.CHILDSUPPORTINGDOCUMENTS}[${index}].custodyDocumentsRequired`,
            defaultValue: (application: Application) => {
              const selectedChildrenExtraData =
                getValueViaPath<Array<SelectedChild>>(
                  application.answers,
                  'selectedChildrenExtraData',
                ) ?? []

              const hasFullCustody =
                selectedChildrenExtraData[index]?.hasFullCustody

              return hasFullCustody === NO ? 'true' : 'false'
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
            condition: (answers: FormValue) => {
              const hasFullCustody = getValueViaPath(
                answers,
                `selectedChildrenExtraData[${index}].hasFullCustody`,
              )

              return hasFullCustody === NO
            },
          }),
        ],
      }),
    ],
  })
