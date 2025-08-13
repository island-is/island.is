import { buildMultiField, buildRadioField, getValueViaPath } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { Country, EducationLevels } from '../../../../types/interfaces'

export const educationLevelField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL}.level`,
      title: disabilityPensionFormMessage.questions.educationLevelTitle,
      options: (application: Application) => {
        const countries = getValueViaPath<Array<Country>>(
          application.externalData,
          'socialInsuranceAdministrationCountries.data',
        ) ?? []

        return countries.map(({ code, nameIcelandic }) => ({
          value: code,
          label: nameIcelandic,
        }))
      },
    }),
  ],
})
