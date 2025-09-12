import {
  NO,
  YesOrNo,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { yesOrNoOptions } from '../../../../utils'
import { SectionRouteEnum } from '../../../../types'
import { FormValue } from '@island.is/application/types'

export const paidWorkSubSection = buildMultiField({
  id: SectionRouteEnum.PAID_WORK,
  title: disabilityPensionFormMessage.employmentParticipation.inPaidWorkTitle,
  space: 'containerGutter',
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.PAID_WORK}.inPaidWork`,
      width: 'full',
      backgroundColor: 'blue',
      required: true,
      options: yesOrNoOptions,
    }),
    buildRadioField({
      id: `${SectionRouteEnum.PAID_WORK}.continuedWork`,
      title:
        disabilityPensionFormMessage.employmentParticipation
          .continuedWorkQuestion,
      width: 'half',
      backgroundColor: 'blue',
      condition: (formValue: FormValue) => {
        const isWorking = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.PAID_WORK}.inPaidWork`,
        )
        return isWorking === NO
      },
      options: yesOrNoOptions,
    }),
  ],
})
