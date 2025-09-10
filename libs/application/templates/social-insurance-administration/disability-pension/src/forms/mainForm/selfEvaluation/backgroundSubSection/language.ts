import {
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { LanguageDto } from '@island.is/clients/social-insurance-administration'

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
          getValueViaPath<Array<LanguageDto>>(
            application.externalData,
            'socialInsuranceAdministrationLanguages.data',
          ) ?? []

        return languages.map(({ value, label }) => ({
            value,
            label,
          }))
      },
    }),
    /*
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
    */
  ],
})
