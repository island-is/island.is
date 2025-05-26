import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
} from '@island.is/application/core'
import { error, extraInformation } from '../../../lib/messages'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import {
  FILE_SIZE_LIMIT,
  FILE_TOTAL_SIZE_LIMIT,
  FILE_TYPES_ALLOWED,
  getEndOfDayUTCDate,
  getFirstRegistrationEndDate,
  LANGUAGE_CODE_ICELANDIC,
} from '../../../utils'

export const extraInformationSection = buildSection({
  id: 'extraInformationSection',
  title: extraInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'extraInformationMultiField',
      title: extraInformation.general.pageTitle,
      children: [
        buildAlertMessageField({
          id: 'alertPastRegistrationEndDate',
          alertType: 'error',
          title: error.errorPastRegistrationDateTitle,
          message: error.errorPastRegistrationDateDescription,
          condition: (answers) => {
            return (
              getEndOfDayUTCDate(getFirstRegistrationEndDate(answers)) <
              new Date()
            )
          },
        }),

        // Native language
        buildDescriptionField({
          id: 'extraInformation.nativeLanguage.subtitle',
          title: extraInformation.nativeLanguage.subtitle,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'extraInformation.nativeLanguageCode',
          title: extraInformation.nativeLanguage.selectLabel,
          placeholder: extraInformation.nativeLanguage.selectPlaceholder,
          width: 'full',
          doesNotRequireAnswer: true,
          isClearable: true,
          options: () => {
            const languages = getAllLanguageCodes().filter(
              (x) => x.code !== LANGUAGE_CODE_ICELANDIC,
            )
            return languages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
        }),

        // Other
        buildDescriptionField({
          id: 'extraInformation.otherDescription.subtitle',
          title: extraInformation.other.subtitle,
          description: extraInformation.other.description,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'extraInformation.otherDescription',
          variant: 'textarea',
          rows: 5,
          title: extraInformation.other.textareaLabel,
          placeholder: extraInformation.other.textareaPlaceholder,
          maxLength: 3000,
          showMaxLength: true,
        }),

        // Supporting documents
        buildDescriptionField({
          id: 'extraInformation.supportingDocuments.subtitle',
          title: extraInformation.supportingDocuments.subtitle,
          description: extraInformation.supportingDocuments.description,
          titleVariant: 'h5',
          space: 3,
        }),
        buildFileUploadField({
          id: 'extraInformation.supportingDocuments',
          introduction: '',
          uploadAccept: FILE_TYPES_ALLOWED,
          maxSize: FILE_SIZE_LIMIT,
          totalMaxSize: FILE_TOTAL_SIZE_LIMIT,
          uploadMultiple: true,
          uploadHeader: extraInformation.supportingDocuments.fileUploadHeader,
          uploadDescription:
            extraInformation.supportingDocuments.fileUploadDescription,
          uploadButtonLabel:
            extraInformation.supportingDocuments.fileUploadButtonLabel,
        }),
      ],
    }),
  ],
})
