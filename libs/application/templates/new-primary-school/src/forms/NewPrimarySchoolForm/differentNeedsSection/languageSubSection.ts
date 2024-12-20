import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES } from '@island.is/application/types'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

export const languageSubSection = buildSubSection({
  id: 'languageSubSection',
  title: newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
  children: [
    buildMultiField({
      id: 'languages',
      title: newPrimarySchoolMessages.differentNeeds.languageTitle,
      description: newPrimarySchoolMessages.differentNeeds.languageDescription,
      children: [
        buildDescriptionField({
          id: 'languages.nativeLanguage.title',
          title: newPrimarySchoolMessages.differentNeeds.childNativeLanguage,
          titleVariant: 'h4',
        }),
        buildSelectField({
          id: 'languages.nativeLanguage',
          dataTestId: 'languages-native-language',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          placeholder:
            newPrimarySchoolMessages.differentNeeds.languagePlaceholder,
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
        buildRadioField({
          id: 'languages.otherLanguagesSpokenDaily',
          title:
            newPrimarySchoolMessages.differentNeeds.otherLanguagesSpokenDaily,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'other-languages',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-other-languages',
              value: NO,
            },
          ],
        }),
        buildSelectField({
          id: 'languages.otherLanguages',
          dataTestId: 'languages-other-languages',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          placeholder:
            newPrimarySchoolMessages.differentNeeds.languagePlaceholder,
          options: () => {
            const languages = getAllLanguageCodes()
            return languages.map((language) => {
              return {
                label: language.name,
                value: language.code,
              }
            })
          },
          isMulti: true,
          condition: (answers) => {
            const { otherLanguagesSpokenDaily } = getApplicationAnswers(answers)

            return otherLanguagesSpokenDaily === YES
          },
        }),
        buildCheckboxField({
          id: 'languages.icelandicNotSpokenAroundChild',
          title: '',
          options: (application) => {
            const { nativeLanguage, otherLanguages } = getApplicationAnswers(
              application.answers,
            )
            const icelandicSelected =
              nativeLanguage === 'is' || otherLanguages?.includes('is')

            return [
              {
                label:
                  newPrimarySchoolMessages.differentNeeds
                    .icelandicNotSpokenAroundChild,
                value: icelandicSelected ? NO : YES,
                disabled: icelandicSelected,
              },
            ]
          },
          condition: (answers) => {
            const { otherLanguagesSpokenDaily } = getApplicationAnswers(answers)

            return otherLanguagesSpokenDaily === YES
          },
        }),
        buildHiddenInput({
          // Needed to trigger an update on options in the checkbox above
          id: 'languages.icelandicSelectedHiddenInput',
          condition: (answers) => {
            const { nativeLanguage, otherLanguages } =
              getApplicationAnswers(answers)

            return nativeLanguage === 'is' || otherLanguages?.includes('is')
          },
        }),
      ],
    }),
  ],
})
