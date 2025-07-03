import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { LanguageEnum, SectionRouteEnum } from '../../../../types'

export const languageField =
  buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_LANGUAGE,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
      title: disabilityPensionFormMessage.questions.languageTitle,
      width: 'full',
      options: [
        {
          value: LanguageEnum.ICELANDIC,
          label: disabilityPensionFormMessage.questions.languageIcelandic,
        },
        {
          value: LanguageEnum.POLISH,
          label: disabilityPensionFormMessage.questions.languagePolish,
        },
        {
          value: LanguageEnum.ENGLISH,
          label: disabilityPensionFormMessage.questions.languageEnglish,
        },
        {
          value: LanguageEnum.LITHUANIAN,
          label: disabilityPensionFormMessage.questions.languageLithuanian,
        },
        {
          value: LanguageEnum.ROMANIAN,
          label: disabilityPensionFormMessage.questions.languageRomanian,
        },
        {
          value: LanguageEnum.CZECH_SLOVAK,
          label: disabilityPensionFormMessage.questions.languageCzechSlovak,
        },
        {
          value: LanguageEnum.PORTUGUESE,
          label: disabilityPensionFormMessage.questions.languagePortuguese,
        },
        {
          value: LanguageEnum.SPANISH,
          label: disabilityPensionFormMessage.questions.languageSpanish,
        },
        {
          value: LanguageEnum.THAI,
          label: disabilityPensionFormMessage.questions.languageThai,
        },
        {
          value: LanguageEnum.FILIPINO,
          label: disabilityPensionFormMessage.questions.languageFilipino,
        },
        {
          value: LanguageEnum.UKRAINIAN,
          label: disabilityPensionFormMessage.questions.languageUkrainian,
        },
        {
          value: LanguageEnum.ARABIC,
          label: disabilityPensionFormMessage.questions.languageArabic,
        },
        {
          value: LanguageEnum.OTHER,
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
        return language === LanguageEnum.OTHER
      },
      variant: 'textarea',
    }),
  ],
})
