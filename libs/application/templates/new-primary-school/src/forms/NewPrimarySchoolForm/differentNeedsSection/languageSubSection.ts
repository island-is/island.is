import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getLanguageEnvironments,
  hasForeignLanguages,
} from '../../../lib/newPrimarySchoolUtils'
import { LanguageSelectionProps } from '../../../fields/LanguageSelection'

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
          id: 'languages.sub.title',
          title: newPrimarySchoolMessages.differentNeeds.languageSubTitle,
          titleVariant: 'h4',
        }),
        buildSelectField({
          id: 'languages.languageEnvironment',
          dataTestId: 'languages-language-environment',
          title:
            newPrimarySchoolMessages.differentNeeds.languageEnvironmentTitle,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .languageEnvironmentPlaceholder,
          options: () => {
            return getLanguageEnvironments()
          },
        }),
        buildDescriptionField({
          id: 'languages.languages.title',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          description:
            newPrimarySchoolMessages.differentNeeds.languagesDescription,
          titleVariant: 'h4',
          condition: (answers) => {
            return hasForeignLanguages(answers)
          },
          marginBottom: 'gutter',
        }),
        buildCustomField(
          {
            id: 'languages',
            title: '',
            component: 'LanguageSelection',
            condition: (answers) => {
              return hasForeignLanguages(answers)
            },
          },
          {} as LanguageSelectionProps,
        ),
        buildRadioField({
          id: 'languages.signLanguage',
          title: newPrimarySchoolMessages.differentNeeds.signLanguage,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'sign-language',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-sign-language',
              value: NO,
            },
          ],
          condition: (answers) => {
            const { languageEnvironment } = getApplicationAnswers(answers)
            return !!languageEnvironment
          },
        }),
        buildRadioField({
          id: 'languages.interpreter',
          title: newPrimarySchoolMessages.differentNeeds.interpreter,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'interpreter',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-interpreter',
              value: NO,
            },
          ],
          condition: (answers) => {
            return hasForeignLanguages(answers)
          },
        }),
      ],
    }),
  ],
})
