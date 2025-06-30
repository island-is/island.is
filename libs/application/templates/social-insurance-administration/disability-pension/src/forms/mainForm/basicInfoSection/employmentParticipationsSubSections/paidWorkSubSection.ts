import {
  buildMultiField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { YesOrNoOptions } from '../../../../lib/options'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { EmploymentEnum } from '../../../../lib/constants'

const paidWorkRoute = `paidWork`

export const paidWorkSubSection = buildMultiField({
  id: paidWorkRoute,
  title: disabilityPensionFormMessage.employmentParticipation.inPaidWorkTitle,
  space: 'containerGutter',
  children: [
    buildRadioField({
      id: `${paidWorkRoute}.inPaidWork`,
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
      id: `${paidWorkRoute}.continuedWork`,
      title: disabilityPensionFormMessage.employmentParticipation.continuedWorkQuestion,
      width: 'half',
      backgroundColor: 'blue',
      condition: (formValue) => {
        const isWorking = getValueViaPath<EmploymentEnum>(
          formValue,
          `${paidWorkRoute}.inPaidWork`,
        )
        return isWorking === EmploymentEnum.YES
      },
      options: YesOrNoOptions,
    }),
  ],
})
