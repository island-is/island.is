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
import {
  Country,
  TravelDocumentType,
} from '@island.is/clients/directorate-of-immigration'
import { Routes } from '../../../lib/constants'
import { CitizenIndividual } from '../../../shared'

const FILE_SIZE_LIMIT = 10000000

export const PassportSubSection = buildSubSection({
  id: Routes.PASSPORT,
  title: supportingDocuments.labels.passport.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.PASSPORT,
      title: supportingDocuments.labels.passport.pageTitle,
      description: (application: Application) => {
        const applicant = getValueViaPath(
          application.externalData,
          'individual.data',
          '',
        ) as CitizenIndividual | undefined

        return {
          ...supportingDocuments.general.description,
          values: {
            person: `${applicant?.givenName} ${applicant?.familyName}`,
          },
        }
      },
      children: [
        buildDescriptionField({
          id: `${Routes.PASSPORT}.title`,
          title: supportingDocuments.labels.passport.title,
          titleVariant: 'h5',
        }),
        buildDateField({
          id: `${Routes.PASSPORT}.publishDate`,
          title: supportingDocuments.labels.passport.publishDate,
          placeholder: supportingDocuments.labels.passport.datePlaceholder,
          width: 'half',
        }),
        buildDateField({
          id: `${Routes.PASSPORT}.expirationDate`,
          title: supportingDocuments.labels.passport.expirationDate,
          placeholder: supportingDocuments.labels.passport.datePlaceholder,
          width: 'half',
        }),
        buildTextField({
          id: `${Routes.PASSPORT}.passportNumber`,
          title: supportingDocuments.labels.passport.passportNumber,
          placeholder: supportingDocuments.labels.passport.numberPlaceholder,
          width: 'half',
        }),
        buildSelectField({
          id: `${Routes.PASSPORT}.passportTypeId`,
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
        buildSelectField({
          id: `${Routes.PASSPORT}.countryOfIssuerId`,
          title: supportingDocuments.labels.passport.publisher,
          placeholder: supportingDocuments.labels.passport.publisher,
          width: 'half',
          options: (application) => {
            const countryOptions = getValueViaPath(
              application.externalData,
              'countries.data',
              [],
            ) as Country[]

            return countryOptions.map(({ id, name }) => ({
              value: id.toString(),
              label: name,
            }))
          },
        }),
        buildFileUploadField({
          id: `${Routes.PASSPORT}.attachment`,
          title: supportingDocuments.labels.passport.fileUpload,
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
