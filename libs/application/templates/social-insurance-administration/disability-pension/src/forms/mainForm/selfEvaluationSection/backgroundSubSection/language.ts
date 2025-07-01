import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { LanguageEnum } from '../../../../lib/constants'
import { SectionRouteEnum } from '../../../../lib/routes'

export const languageField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_LANGUAGE,
  title: disabilityPensionFormMessage.questions.languageTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
      width: 'full',
      options: [
        {
          value: LanguageEnum.icelandic,
          label: disabilityPensionFormMessage.questions.languageIcelandic,
        },
        {
          value: LanguageEnum.polish,
          label: disabilityPensionFormMessage.questions.languagePolish,
        },
        {
          value: LanguageEnum.english,
          label: disabilityPensionFormMessage.questions.languageEnglish,
        },
        {
          value: LanguageEnum.lithuanian,
          label: disabilityPensionFormMessage.questions.languageLithuanian,
        },
        {
          value: LanguageEnum.romanian,
          label: disabilityPensionFormMessage.questions.languageRomanian,
        },
        {
          value: LanguageEnum.czechSlovak,
          label: disabilityPensionFormMessage.questions.languageCzechSlovak,
        },
        {
          value: LanguageEnum.portuguese,
          label: disabilityPensionFormMessage.questions.languagePortuguese,
        },
        {
          value: LanguageEnum.spanish,
          label: disabilityPensionFormMessage.questions.languageSpanish,
        },
        {
          value: LanguageEnum.thai,
          label: disabilityPensionFormMessage.questions.languageThai,
        },
        {
          value: LanguageEnum.filipino,
          label: disabilityPensionFormMessage.questions.languageFilipino,
        },
        {
          value: LanguageEnum.ukrainian,
          label: disabilityPensionFormMessage.questions.languageUkrainian,
        },
        {
          value: LanguageEnum.arabic,
          label: disabilityPensionFormMessage.questions.languageArabic,
        },
        {
          value: LanguageEnum.other,
          label: disabilityPensionFormMessage.questions.languageOther,
        },
      ]
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.other`,
      title: disabilityPensionFormMessage.questions.languageOtherSpecify,
      condition: (formValue) => {
        const language = getValueViaPath<LanguageEnum>(
          formValue,
          SectionRouteEnum.BACKGROUND_INFO_LANGUAGE,
        )
        return language === LanguageEnum.other
      },
      variant: 'textarea',
    }),
  ],
})
