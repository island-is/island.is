import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildTextField,
  buildDateField,
  buildFileUploadField,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { getSelectedIndividualName } from '../../../utils'
import { TravelDocumentType } from '@island.is/clients/directorate-of-immigration/citizenship'

const FILE_SIZE_LIMIT = 10000000

export const PassportSubSection = (index: number) =>
  buildSubSection({
    id: `passport${index}`,
    title: supportingDocuments.labels.passport.subSectionTitle,
    children: [
      buildMultiField({
        id: `passportMultiField${index}`,
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
            id: `passport${index}.title`,
            title: supportingDocuments.labels.passport.title,
            titleVariant: 'h5',
          }),
          buildDateField({
            id: `passport[${index}].publishDate`,
            title: supportingDocuments.labels.passport.publishDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
          }),
          buildDateField({
            id: `passport[${index}].expirationDate`,
            title: supportingDocuments.labels.passport.expirationDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
          }),
          buildTextField({
            id: `passport[${index}].passportNumber`,
            title: supportingDocuments.labels.passport.passportNumber,
            placeholder: supportingDocuments.labels.passport.numberPlaceholder,
            width: 'half',
          }),
          buildSelectField({
            id: `passport[${index}].passportType`,
            title: supportingDocuments.labels.passport.passportType,
            placeholder: supportingDocuments.labels.passport.typePlaceholder,
            width: 'half',
            options: (application) => {
              const travelDocumentTypes = getValueViaPath(
                application.externalData,
                'travelDocumentTypes.data',
                [],
              ) as TravelDocumentType[]

              return travelDocumentTypes.map(({ id, name }) => ({
                value: id.toString(),
                label: name,
              }))
            },
          }),
          buildTextField({
            id: `passport[${index}].publisher`,
            title: supportingDocuments.labels.passport.publisher,
            width: 'half',
          }),
          buildFileUploadField({
            id: 'passport.attachment',
            title: '',
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader: 'æljksadf', //TODO
          }),
        ],
      }),
    ],
  })
