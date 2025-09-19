import { buildMultiField, buildRadioField } from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { Application } from '@island.is/application/types'
import { getApplicationExternalData } from '../../../../utils'

export const educationLevelField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL}.level`,
      title: m.questions.educationLevelTitle,
      required: true,
      options: (application: Application) => {
        const { educationLevels = [] } = getApplicationExternalData(
          application.externalData,
        )

        return educationLevels.map(({ code, description }) => ({
          value: code,
          label: description,
        }))
      },
    }),
  ],
})
