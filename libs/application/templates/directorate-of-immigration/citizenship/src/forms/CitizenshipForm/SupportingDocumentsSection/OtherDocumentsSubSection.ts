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
import { ExternalData } from '../../../types'
import { getSelectedCustodyChildren } from '../../../utils/childrenInfo'
import * as kennitala from 'kennitala'

const FILE_SIZE_LIMIT = 10000000

export const OtherDocumentsSubSection = (index: number) =>
  buildSubSection({
    id: 'otherDocuments',
    title: supportingDocuments.labels.otherDocuments.subSectionTitle,
    children: [
      buildMultiField({
        id: 'otherDocumentsMultiField',
        title: supportingDocuments.labels.otherDocuments.pageTitle,
        description: (application: Application) => {
          const externalData = application.externalData as ExternalData
          const answers = application.answers as Citizenship
          const selectedInCustody = getSelectedCustodyChildren(
            externalData,
            answers,
          )

          const personName =
            index === 0
              ? answers.userInformation?.name
              : !!selectedInCustody && selectedInCustody[index - 1]?.fullName

          return {
            ...supportingDocuments.general.description,
            values: {
              person: `${personName}`,
            },
          }
        },
        condition: () => {
          return index === 0
        },
        children: [
          buildDescriptionField({
            id: 'otherDocuments.title',
            title: supportingDocuments.labels.otherDocuments.title,
            titleVariant: 'h5',
          }),

          buildFileUploadField({
            id: `otherDocuments${index}.birthCertificate`,
            title: supportingDocuments.labels.otherDocuments.birthCertificate,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocuments.birthCertificate,
            condition: (formValue: FormValue) => {
              const answers = formValue as Citizenship

              if (answers.residenceCondition?.radio === 'childOfIcelander') {
                return true
              }
              return false
            },
          }),

          buildFileUploadField({
            id: `otherDocuments${index}.incomeConfirmation`,
            title: supportingDocuments.labels.otherDocuments.incomeConfirmation,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocuments.incomeConfirmation,
          }),

          buildFileUploadField({
            id: `otherDocuments${index}.incomeConfirmationTown`,
            title: supportingDocuments.labels.otherDocuments.incomeConfirmationTown,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocuments.incomeConfirmationTown,
          }),

          buildFileUploadField({
            id: `otherDocuments${index}.legalHome`,
            title: supportingDocuments.labels.otherDocuments.legalHome,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocuments.legalHome,
          }),

          buildFileUploadField({
            id: `otherDocuments${index}.icelandicTest`,
            title: supportingDocuments.labels.otherDocuments.icelandicTest,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocuments.icelandicTest,
          }),
        
          buildCustomField({
            id: `otherDocuments${index}.criminalRecord`,
            title: '',
            component: 'CriminalRecords',
          }),
        ],
      }),
      buildMultiField({
        id: 'otherDocumentsChildrenMultiField',
        title: supportingDocuments.labels.otherDocuments.pageTitle,
        description: (application: Application) => {
          const externalData = application.externalData as ExternalData
          const answers = application.answers as Citizenship
          const selectedInCustody = getSelectedCustodyChildren(
            externalData,
            answers,
          )

          const personName =
            index === 0
              ? answers.userInformation?.name
              : !!selectedInCustody && selectedInCustody[index - 1]?.fullName

          return {
            ...supportingDocuments.general.description,
            values: {
              person: `${personName}`,
            },
          }
        },
        condition: () => {
          return index > 0
        },
        children: [
          buildDescriptionField({
            id: 'otherDocuments.title',
            title: supportingDocuments.labels.otherDocuments.title,
            titleVariant: 'h5',
          }),
          buildFileUploadField({
            id: `otherDocuments${index}.birthCertificate`,
            title: supportingDocuments.labels.otherDocumentsChildren.birthCertificate,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocumentsChildren.birthCertificate,
          }),
          buildFileUploadField({
            id: `otherDocuments${index}.writtenConsent`,
            title: supportingDocuments.labels.otherDocumentsChildren.writtenConsent,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocumentsChildren.writtenConsent,
            condition: (formValue: FormValue, externalData) => {
              const answers = formValue as Citizenship
              const selectedInCustody = getSelectedCustodyChildren(
                externalData,
                answers,
              )
              const thisChild =
                !!selectedInCustody &&
                selectedInCustody.find((_, i) => i === index - 1)
              const childAge =
                !!thisChild && kennitala.info(thisChild?.nationalId)
              if (!!childAge && childAge.age >= 12) {
                return true
              }
              return false
            },
          }),
          buildFileUploadField({
            id: `otherDocuments${index}.otherParentConsent`,
            title: supportingDocuments.labels.otherDocumentsChildren.otherParentConsent,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocumentsChildren.otherParentConsent,
            condition: (formValue: FormValue, externalData) => {
              const answers = formValue as Citizenship
              const selectedInCustody = getSelectedCustodyChildren(
                externalData,
                answers,
              )
              const thisChild =
                !!selectedInCustody &&
                selectedInCustody.find((_, i) => i === index - 1)
              const childAge =
                !!thisChild && kennitala.info(thisChild?.nationalId)

              return true
            },
          }),
          buildFileUploadField({
            id: `otherDocuments${index}.custodyDocuments`,
            title: supportingDocuments.labels.otherDocumentsChildren.custodyDocuments,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: supportingDocuments.labels.otherDocumentsChildren.custodyDocuments,
          }),
        ],
      }),
    ],
  })
