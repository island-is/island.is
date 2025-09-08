import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { LanguageEnum, SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { Language } from '../../../../types/interfaces'

export const languageField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_LANGUAGE,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
      title: disabilityPensionFormMessage.questions.languageTitle,
      width: 'full',
      options: (application: Application) => {
        const languages =
          getValueViaPath<Array<Language>>(
            application.externalData,
            'socialInsuranceAdministrationLanguages.data',
          ) ?? []

        return languages.map(({ code, nameIs }) => ({
          value: code,
          label: nameIs,
        }))
      },
    }),
    buildTitleField({
      title: disabilityPensionFormMessage.questions.languageOtherSpecify,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const language = getValueViaPath<LanguageEnum>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
        )
        return language === LanguageEnum.OTHER
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.other`,
      condition: (formValue) => {
        const language = getValueViaPath<LanguageEnum>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
        )
        return language === LanguageEnum.OTHER
      },
      variant: 'textarea',
    }),
  ],
})
