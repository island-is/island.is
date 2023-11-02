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
  OptionSetItem,
  TravelDocumentViewModel,
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
          defaultValue: (application: Application) => {
            const passport = getValueViaPath(
              application.externalData,
              'currentPassportItem.data',
              undefined,
            ) as TravelDocumentViewModel | undefined

            return passport?.dateOfIssue
          },
        }),
        buildDateField({
          id: `${Routes.PASSPORT}.expirationDate`,
          title: supportingDocuments.labels.passport.expirationDate,
          placeholder: supportingDocuments.labels.passport.datePlaceholder,
          width: 'half',
          defaultValue: (application: Application) => {
            const passport = getValueViaPath(
              application.externalData,
              'currentPassportItem.data',
              undefined,
            ) as TravelDocumentViewModel | undefined

            return passport?.dateOfExpiry
          },
        }),
        buildTextField({
          id: `${Routes.PASSPORT}.passportNumber`,
          title: supportingDocuments.labels.passport.passportNumber,
          placeholder: supportingDocuments.labels.passport.numberPlaceholder,
          width: 'half',
          defaultValue: (application: Application) => {
            const passport = getValueViaPath(
              application.externalData,
              'currentPassportItem.data',
              undefined,
            ) as TravelDocumentViewModel | undefined

            return passport?.travelDocumentNo
          },
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
            ) as OptionSetItem[]

            return travelDocumentTypes.map(({ id, name }) => ({
              value: id?.toString() || '',
              label: name || '',
            }))
          },
          defaultValue: (application: Application) => {
            const passport = getValueViaPath(
              application.externalData,
              'currentPassportItem.data',
              undefined,
            ) as TravelDocumentViewModel | undefined

            return passport?.travelDocumentTypeId?.toString()
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
            ) as OptionSetItem[]

            return countryOptions.map(({ id, name }) => ({
              value: id?.toString() || '',
              label: name || '',
            }))
          },
          defaultValue: (application: Application) => {
            const passport = getValueViaPath(
              application.externalData,
              'currentPassportItem.data',
              undefined,
            ) as TravelDocumentViewModel | undefined

            return passport?.issuingCountryId?.toString()
          },
        }),
        buildFileUploadField({
          id: `${Routes.PASSPORT}.file`,
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
