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
import { CitizenIndividual } from '../../../shared'
import { Routes } from '../../../lib/constants'

const FILE_SIZE_LIMIT = 10000000

export const PassportSubSection = (index: number) =>
  buildSubSection({
    id: `passports[${index}]`,
    title: supportingDocuments.labels.passport.subSectionTitle,
    children: [
      buildMultiField({
        id: `passports[${index}]`,
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
          // buildTextField({
          //   id: `passports[${index}].nationalId`,
          //   title: '',
          //   defaultValue: (application: Application) => {
          //     const individual = getValueViaPath(
          //       application.externalData,
          //       'individual.data',
          //       undefined,
          //     ) as CitizenIndividual | undefined

          //     return individual?.nationalId
          //   },
          // }),
          buildDescriptionField({
            id: `passports[${index}].passport.title`,
            title: supportingDocuments.labels.passport.title,
            titleVariant: 'h5',
          }),
          buildDateField({
            id: `passports[${index}].passport.publishDate`,
            title: supportingDocuments.labels.passport.publishDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
          }),
          buildDateField({
            id: `passports[${index}].passport.expirationDate`,
            title: supportingDocuments.labels.passport.expirationDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
          }),
          buildTextField({
            id: `passports[${index}].passport.passportNumber`,
            title: supportingDocuments.labels.passport.passportNumber,
            placeholder: supportingDocuments.labels.passport.numberPlaceholder,
            width: 'half',
          }),
          buildSelectField({
            id: `passports[${index}].passport.passportType`,
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
            id: `passports[${index}].passport.publisher`,
            title: supportingDocuments.labels.passport.publisher,
            width: 'half',
          }),
          buildFileUploadField({
            id: `passports[${index}].passport.attachment`,
            title: '',
            introduction: '',
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.passport.uploadTitlePlaceholder,
          }),
        ],
      }),
    ],
  })
