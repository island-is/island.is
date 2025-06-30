import {
  buildMultiField,
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { YesOrNoOptions } from '../../../../lib/utils'

const abroadPaymentsRoute = `abroadPayments`

export const abroadPaymentsSubSection = buildMultiField({
  id: abroadPaymentsRoute,
  title: disabilityPensionFormMessage.employmentParticipation.abroadPaymentsTitle,
  description: disabilityPensionFormMessage.employmentParticipation.abroadPaymentsDescription,
  children: [
    buildRadioField({
      id: `${abroadPaymentsRoute}.hasAbroadPayments`,
      width: 'half',
      backgroundColor: 'blue',
      required: true,
      options: YesOrNoOptions,
    }),
  ],
})
