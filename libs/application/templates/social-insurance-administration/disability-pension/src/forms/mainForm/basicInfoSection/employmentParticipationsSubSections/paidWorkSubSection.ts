import {
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { yesOrNoOptions } from '../../../../utils'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { EmploymentEnum, SectionRouteEnum } from '../../../../types'

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
      options: [
        {
          value: EmploymentEnum.YES,
          label: socialInsuranceAdministrationMessage.shared.yes,
        },
        {
          value: EmploymentEnum.NO,
          label:  socialInsuranceAdministrationMessage.shared.no,
        },
        {
          value: EmploymentEnum.DONT_KNOW,
          label: disabilityPensionFormMessage.employmentParticipation.dontKnow,
        },
      ],
    }),
    buildRadioField({
      id: `${SectionRouteEnum.PAID_WORK}.continuedWork`,
      title: disabilityPensionFormMessage.employmentParticipation.continuedWorkQuestion,
      width: 'half',
      backgroundColor: 'blue',
      condition: (formValue) => {
        const isWorking = getValueViaPath<EmploymentEnum>(
          formValue,
          `${SectionRouteEnum.PAID_WORK}.inPaidWork`,
        )
        return isWorking === EmploymentEnum.YES
      },
      options: yesOrNoOptions,
    }),
  ],
})
