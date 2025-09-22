import { buildMultiField, buildRadioField } from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { Application } from '@island.is/application/types'
import { getApplicationExternalData } from '../../../../utils'

export const maritalStatusField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS,

  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS}.status`,
      title: m.questions.maritalStatusTitle,
      options: (application: Application) => {
        const { maritalStatuses = [] } = getApplicationExternalData(
          application.externalData,
        )

        return maritalStatuses?.map(({ value, label }) => ({
          value: value.toString(),
          label,
        }))
      },
    }),
  ],
})
