import { buildRadioField, buildSubSection } from '@island.is/application/core'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { Employment } from '../../../utils/constants'

export const employmentStatusSubSection = buildSubSection({
  id: 'employmentStatusSubSection',
  title: oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
  children: [
    buildRadioField({
      id: 'employment.status',
      title: oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
      description:
        oldAgePensionFormMessage.employer.selfEmployedOrEmployeeDescription,
      options: [
        {
          value: Employment.SELFEMPLOYED,
          label: oldAgePensionFormMessage.employer.selfEmployed,
        },
        {
          value: Employment.EMPLOYEE,
          label: oldAgePensionFormMessage.employer.employee,
        },
      ],
      width: 'half',
      defaultValue: Employment.EMPLOYEE,
      largeButtons: true,
    }),
  ],
})
