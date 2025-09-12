import {
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { EducationLevels } from '../../../../types/interfaces'

export const educationLevelField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL}.level`,
      title: disabilityPensionFormMessage.questions.educationLevelTitle,
      required: true,
      options: (application: Application) => {
        const educationLevels =
          getValueViaPath<Array<EducationLevels>>(
            application.externalData,
            'socialInsuranceAdministrationEducationLevels.data',
          ) ?? []

        return educationLevels.map(({ code, description }) => ({
          value: code,
          label: description,
        }))
      },
    }),
  ],
})
