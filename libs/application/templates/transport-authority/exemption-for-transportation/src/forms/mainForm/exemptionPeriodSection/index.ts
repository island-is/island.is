import {
  buildAlertMessageField,
  buildDateField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { exemptionPeriod } from '../../../lib/messages'
import { ExemptionType } from '../../../shared'
import {
  getExemptionType,
  checkIfExemptionTypeLongTerm,
  getMinDateFrom,
  getMaxDateFrom,
  getMinDateTo,
  getMaxDateTo,
} from '../../../utils'

export const exemptionPeriodSection = buildSection({
  id: 'exemptionPeriodSection',
  title: exemptionPeriod.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'exemptionPeriodMultiField',
      title: exemptionPeriod.general.pageTitle,
      description: exemptionPeriod.general.description,
      children: [
        buildRadioField({
          id: 'exemptionPeriod.type',
          title: exemptionPeriod.type.subtitle,
          options: [
            {
              value: ExemptionType.SHORT_TERM,
              label: exemptionPeriod.type.shortTermOptionTitle,
            },
            {
              value: ExemptionType.LONG_TERM,
              label: exemptionPeriod.type.longTermOptionTitle,
            },
          ],
          width: 'half',
          clearOnChange: ['exemptionPeriod.dateFrom', 'exemptionPeriod.dateTo'],
        }),
        buildAlertMessageField({
          id: 'exemptionTypeLongTermAlertMessage',
          alertType: 'info',
          title: exemptionPeriod.type.alertTitle,
          message: exemptionPeriod.type.alertMessage,
          condition: (answers) => {
            return checkIfExemptionTypeLongTerm(answers)
          },
        }),
        buildDateField({
          id: 'exemptionPeriod.dateFrom',
          title: exemptionPeriod.period.dateFrom,
          width: 'half',
          required: true,
          placeholder: exemptionPeriod.period.datePlaceholder,
          condition: (answers) => {
            return !!getExemptionType(answers)
          },
          minDate: (application) => getMinDateFrom(application.answers),
          maxDate: (application) => getMaxDateFrom(application.answers),
        }),
        buildDateField({
          id: 'exemptionPeriod.dateTo',
          title: exemptionPeriod.period.dateTo,
          width: 'half',
          required: true,
          placeholder: exemptionPeriod.period.datePlaceholder,
          condition: (answers) => {
            return !!getExemptionType(answers)
          },
          minDate: (application) => getMinDateTo(application.answers),
          maxDate: (application) => getMaxDateTo(application.answers),
        }),
      ],
    }),
  ],
})
