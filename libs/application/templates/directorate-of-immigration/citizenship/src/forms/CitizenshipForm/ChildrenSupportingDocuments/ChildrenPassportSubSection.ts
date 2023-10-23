import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildTextField,
  buildDateField,
  buildFileUploadField,
  buildSelectField,
  getValueViaPath,
  buildCustomField,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { getSelectedIndividualName } from '../../../utils'
import { OptionSetItem } from '@island.is/clients/directorate-of-immigration'
import { Routes } from '../../../lib/constants'

const FILE_SIZE_LIMIT = 10000000

export const ChildrenPassportSubSection = (index: number) =>
  buildSubSection({
    id: `${Routes.CHILDRENPASSPORT}[${index}]`,
    title: supportingDocuments.labels.passport.subSectionTitle,
    children: [
      buildMultiField({
        id: Routes.CHILDRENPASSPORT,
        title: supportingDocuments.labels.passport.pageTitle,
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
            id: `${Routes.CHILDRENPASSPORT}[${index}].title`,
            title: supportingDocuments.labels.passport.title,
            titleVariant: 'h5',
          }),
          buildCustomField(
            {
              id: `${Routes.CHILDRENPASSPORT}[${index}].nationalId`,
              title: '',
              component: 'HiddenTextInput',
            },
            {
              index: index,
            },
          ),
          buildDateField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].publishDate`,
            title: supportingDocuments.labels.passport.publishDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
          }),
          buildDateField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].expirationDate`,
            title: supportingDocuments.labels.passport.expirationDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
          }),
          buildTextField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].passportNumber`,
            title: supportingDocuments.labels.passport.passportNumber,
            placeholder: supportingDocuments.labels.passport.numberPlaceholder,
            width: 'half',
          }),
          buildSelectField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].passportTypeId`,
            title: supportingDocuments.labels.passport.passportType,
            placeholder: supportingDocuments.labels.passport.typePlaceholder,
            width: 'half',
            options: (application) => {
              const travelDocumentTypes = getValueViaPath(
                application.externalData,
                'travelDocumentTypes.data',
                [],
              ) as OptionSetItem[]

              return travelDocumentTypes.map(({ id, name }) => ({
                value: id?.toString() || '',
                label: name || '',
              }))
            },
          }),
          buildSelectField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].countryOfIssuerId`,
            title: supportingDocuments.labels.passport.publisher,
            placeholder: supportingDocuments.labels.passport.publisher,
            width: 'half',
            options: (application) => {
              const countryOptions = getValueViaPath(
                application.externalData,
                'countries.data',
                [],
              ) as OptionSetItem[]

              return countryOptions.map(({ id, name }) => ({
                value: id?.toString() || '',
                label: name || '',
              }))
            },
          }),
          buildFileUploadField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].attachment`,
            title: supportingDocuments.labels.passport.uploadTitlePlaceholder,
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.passport.uploadTitlePlaceholder,
            uploadDescription:
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            uploadButtonLabel:
              supportingDocuments.labels.otherDocuments.buttonText,
          }),
        ],
      }),
    ],
  })
