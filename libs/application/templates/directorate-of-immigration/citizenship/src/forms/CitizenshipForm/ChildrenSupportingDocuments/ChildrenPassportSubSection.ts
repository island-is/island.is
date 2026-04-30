import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildTextField,
  buildDateField,
  buildFileUploadField,
  buildSelectField,
  buildRadioField,
  getValueViaPath,
  buildHiddenInput,
  YES,
  NO,
} from '@island.is/application/core'
import { information, supportingDocuments } from '../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import {
  getSelectedCustodyChild,
  getSelectedIndividualName,
} from '../../../utils'
import { OptionSetItem } from '@island.is/clients/directorate-of-immigration'
import { Routes } from '../../../lib/constants'
import { FILE_TYPES_ALLOWED } from '../../../shared'

const FILE_SIZE_LIMIT = 10000000

export const ChildrenPassportSubSection = (index: number) => {
  const showWhenHasPassport = (formValue: FormValue) =>
    getValueViaPath(
      formValue,
      `${Routes.CHILDRENPASSPORT}[${index}].hasPassport`,
    ) !== NO

  return buildSubSection({
    id: `${Routes.CHILDRENPASSPORT}[${index}]`,
    title: supportingDocuments.labels.passport.subSectionTitle,
    children: [
      buildMultiField({
        id: `${Routes.CHILDRENPASSPORT}[${index}]`,
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
          buildHiddenInput({
            id: `${Routes.CHILDRENPASSPORT}[${index}].nationalId`,
            defaultValue: (application: Application) => {
              const selectedChild = getSelectedCustodyChild(
                application.externalData,
                application.answers,
                index,
              )
              return selectedChild?.nationalId
            },
          }),
          buildRadioField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].hasPassport`,
            title: supportingDocuments.labels.passport.hasPassportTitle,
            width: 'half',
            defaultValue: YES,
            options: [
              {
                value: YES,
                label: information.labels.radioButtons.radioOptionYes,
              },
              {
                value: NO,
                label: information.labels.radioButtons.radioOptionNo,
              },
            ],
          }),
          buildDateField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].publishDate`,
            title: supportingDocuments.labels.passport.publishDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
            maxDate: new Date(),
            condition: showWhenHasPassport,
          }),
          buildDateField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].expirationDate`,
            title: supportingDocuments.labels.passport.expirationDate,
            placeholder: supportingDocuments.labels.passport.datePlaceholder,
            width: 'half',
            condition: showWhenHasPassport,
          }),
          buildTextField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].passportNumber`,
            title: supportingDocuments.labels.passport.passportNumber,
            placeholder: supportingDocuments.labels.passport.numberPlaceholder,
            width: 'half',
            condition: showWhenHasPassport,
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
            condition: showWhenHasPassport,
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
            condition: showWhenHasPassport,
          }),
          buildFileUploadField({
            id: `${Routes.CHILDRENPASSPORT}[${index}].attachment`,
            title: supportingDocuments.labels.passport.uploadTitlePlaceholder,
            introduction: '',
            uploadAccept: FILE_TYPES_ALLOWED,
            maxSize: FILE_SIZE_LIMIT,
            uploadHeader:
              supportingDocuments.labels.passport.uploadTitlePlaceholder,
            uploadDescription:
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            uploadButtonLabel:
              supportingDocuments.labels.otherDocuments.buttonText,
            condition: showWhenHasPassport,
          }),
        ],
      }),
    ],
  })
}
