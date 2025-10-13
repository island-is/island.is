import {
  YES,
  YesOrNo,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { yesOrNoOptions } from '../../../../utils'
import { SectionRouteEnum } from '../../../../types/routes'
import { FormValue } from '@island.is/application/types'
import * as m from '../../../../lib/messages'

export const paidWorkSubSection = buildMultiField({
  id: SectionRouteEnum.PAID_WORK,
  title: m.employmentParticipation.inPaidWorkTitle,
  space: 'containerGutter',
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.PAID_WORK}.inPaidWork`,
      width: 'full',
      required: true,
      options: yesOrNoOptions,
    }),
    buildRadioField({
      id: `${SectionRouteEnum.PAID_WORK}.continuedWork`,
      title: m.employmentParticipation.continuedWorkQuestion,
      width: 'half',
      condition: (formValue: FormValue) => {
        const isWorking = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.PAID_WORK}.inPaidWork`,
        )
        return isWorking === YES
      },
      options: yesOrNoOptions,
    }),
  ],
})
