import {
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { Application } from '@island.is/application/types'
import { LanguageDto } from '@island.is/clients/social-insurance-administration'

export const languageField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_LANGUAGE,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
      title: m.questions.languageTitle,
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
  ],
})
