import {
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { MaritalStatusEnum, SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { MaritalStatus } from '../../../../types/interfaces'

export const maritalStatusField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS,

  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS}.status`,
      title: disabilityPensionFormMessage.questions.maritalStatusTitle,
      options: (application: Application) => {
        const maritalStatuses =
          getValueViaPath<Array<MaritalStatus>>(
            application.externalData,
            'socialInsuranceAdministrationMaritalStatuses',
          ) ?? []

        return maritalStatuses.map(({ value, label }) => ({
          value: value.toString(),
          label,
        }))
      },
    }),
  ],
})
