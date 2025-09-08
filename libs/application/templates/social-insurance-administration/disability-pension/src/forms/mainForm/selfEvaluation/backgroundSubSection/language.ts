import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { Language } from '../../../../types/interfaces'
import { Locale } from '@island.is/shared/types'

export const languageField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_LANGUAGE,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
      title: disabilityPensionFormMessage.questions.languageTitle,
      width: 'full',
      options: (application: Application, _, locale: Locale) => {
        const languages =
          getValueViaPath<Array<Language>>(
            application.externalData,
            'socialInsuranceAdministrationLanguages.data',
          ) ?? []

        return [
          ...languages.map(({ code, nameIs, nameEn }) => ({
            value: code,
            label: locale === 'en' ? nameEn : nameIs,
          })),
          {
            value: 'other',
            label: locale === 'en' ? 'Other' : 'Annað',
          },
        ]
      },
    }),
    buildTitleField({
      title: disabilityPensionFormMessage.questions.languageOtherSpecify,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const language = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
        )
        return language === 'other'
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.other`,
      condition: (formValue) => {
        const language = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
        )
        return language === 'other'
      },
      variant: 'textarea',
    }),
  ],
})
