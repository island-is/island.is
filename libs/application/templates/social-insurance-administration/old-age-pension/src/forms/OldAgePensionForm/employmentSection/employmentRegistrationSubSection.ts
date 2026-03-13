import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildRepeater,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { Employment, RatioType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  isRatioType,
} from '../../../utils/oldAgePensionUtils'

export const employmentRegistrationSubSection = buildSubSection({
  id: 'employmentRegistrationSubSection',
  title: oldAgePensionFormMessage.employer.registrationTitle,
  condition: (answers) => {
    const { employmentStatus } = getApplicationAnswers(answers)

    return employmentStatus === Employment.EMPLOYEE
  },
  children: [
    buildRepeater({
      id: 'employers',
      title: oldAgePensionFormMessage.employer.employerTitle,
      component: 'EmployersOverview',
      children: [
        buildMultiField({
          id: 'addEmployers',
          title: oldAgePensionFormMessage.employer.registrationTitle,
          isPartOfRepeater: true,
          children: [
            buildTextField({
              id: 'email',
              title: oldAgePensionFormMessage.employer.email,
              variant: 'email',
            }),
            buildTextField({
              id: 'phoneNumber',
              title: oldAgePensionFormMessage.employer.phoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildRadioField({
              id: 'ratioType',
              width: 'half',
              space: 3,
              options: [
                {
                  value: RatioType.YEARLY,
                  label: oldAgePensionFormMessage.employer.ratioYearly,
                },
                {
                  value: RatioType.MONTHLY,
                  label: oldAgePensionFormMessage.employer.ratioMonthly,
                },
              ],
            }),
            buildTextField({
              id: 'ratioYearly',
              title: oldAgePensionFormMessage.employer.ratio,
              suffix: '%',
              condition: (answers) => isRatioType(answers, RatioType.YEARLY),
              placeholder: '1-50%',
              variant: 'number',
              width: 'full',
            }),
            buildCustomField({
              id: 'ratioMonthly',
              component: 'EmployersRatioMonthly',
              condition: (answers) => isRatioType(answers, RatioType.MONTHLY),
            }),
          ],
        }),
      ],
    }),
  ],
})
