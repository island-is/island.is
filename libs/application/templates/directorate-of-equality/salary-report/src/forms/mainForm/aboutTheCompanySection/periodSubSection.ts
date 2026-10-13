import {
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { messages } from '../../../lib/messages'
import {
  PERIOD_ONE_MONTH,
  PERIOD_TWELVE_MONTHS,
} from '../../../utils/constants'
import {
  getSalaryPeriodMonthOptions,
  getSalaryPeriodYearOptions,
} from '../../../utils/periodOptions'

const isOneMonth = (answers: FormValue) =>
  getValueViaPath(answers, 'period.period') === PERIOD_ONE_MONTH

export const periodSubSection = buildSubSection({
  id: 'period',
  title: messages.aboutTheCompany.period.sectionTitle,
  children: [
    buildMultiField({
      id: 'periodMultiField',
      title: messages.aboutTheCompany.period.title,
      description: messages.aboutTheCompany.period.intro,
      children: [
        buildRadioField({
          id: 'period.period',
          title: messages.aboutTheCompany.period.label,
          largeButtons: true,
          required: true,
          marginBottom: 3,
          defaultValue: PERIOD_TWELVE_MONTHS,
          clearOnChange: ['period.year', 'period.month'],
          options: [
            {
              value: PERIOD_TWELVE_MONTHS,
              label: messages.aboutTheCompany.period.medium12months,
            },
            {
              value: PERIOD_ONE_MONTH,
              label: messages.aboutTheCompany.period.oneMonth,
            },
          ],
        }),
        buildSelectField({
          id: 'period.year',
          title: messages.aboutTheCompany.period.year,
          required: true,
          width: 'half',
          clearOnChange: ['period.month'],
          condition: isOneMonth,
          options: () => getSalaryPeriodYearOptions(),
          marginBottom: 4,
        }),
        buildSelectField({
          id: 'period.month',
          title: messages.aboutTheCompany.period.month,
          required: true,
          width: 'half',
          marginBottom: 4,
          condition: isOneMonth,
          options: ({ answers }) =>
            getSalaryPeriodMonthOptions(
              getValueViaPath(answers, 'period.year'),
            ),
        }),
      ],
    }),
  ],
})
