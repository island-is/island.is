import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { extraInformation } from '../../../lib/messages'
import { getAllLanguageCodes } from '@island.is/shared/utils'

export const extraInformationSection = buildSection({
  id: 'extraInformationSection',
  title: extraInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'extraInformationMultiField',
      title: extraInformation.general.pageTitle,
      description: extraInformation.general.description,
      children: [
        // Native language
        buildDescriptionField({
          id: 'extraInformation.nativeLanguage.subtitle',
          title: extraInformation.nativeLanguage.subtitle,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'extraInformation.nativeLanguage',
          title: extraInformation.nativeLanguage.selectLabel,
          placeholder: extraInformation.nativeLanguage.selectPlaceholder,
          width: 'full',
          options: () => {
            const languages = getAllLanguageCodes()
            return languages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
        }),

        // Disability
        buildDescriptionField({
          id: 'extraInformation.disability.subtitle',
          title: extraInformation.disability.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildCheckboxField({
          id: 'extraInformation.hasDisability',
          title: '',
          large: false,
          backgroundColor: 'white',
          options: [
            {
              value: YES,
              label: extraInformation.disability.checkboxLabel,
            },
          ],
        }),
        buildTextField({
          id: 'extraInformation.disabilityDescription',
          variant: 'textarea',
          rows: 5,
          title: extraInformation.disability.textareaLabel,
          placeholder: extraInformation.disability.textareaPlaceholder,
        }),

        // Other
        buildDescriptionField({
          id: 'extraInformation.other.subtitle',
          title: extraInformation.other.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'extraInformation.otherDescription',
          variant: 'textarea',
          rows: 5,
          title: extraInformation.other.textareaLabel,
          placeholder: extraInformation.other.textareaPlaceholder,
        }),
      ],
    }),
  ],
})
