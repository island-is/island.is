import {
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { MaritalStatusDto } from '@island.is/clients/social-insurance-administration'

export const maritalStatusField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS,

  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS}.status`,
      title: m.questions.maritalStatusTitle,
      options: (application: Application) => {
        const maritalStatuses =
          getValueViaPath<Array<MaritalStatusDto>>(
            application.externalData,
            'socialInsuranceAdministrationMaritalStatuses.data',
          ) ?? []

        return maritalStatuses?.map(({ value, label }) => ({
          value: value.toString(),
          label,
        }))
      },
    }),
  ],
})
