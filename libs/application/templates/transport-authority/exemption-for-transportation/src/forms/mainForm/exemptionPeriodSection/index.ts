import {
  buildAlertMessageField,
  buildDateField,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { exemptionPeriod } from '../../../lib/messages'
import { ExemptionType } from '../../../shared'
import {
  LONG_TERM_MAX_DAYS,
  LONG_TERM_MIN_DAYS,
  MS_IN_DAY,
  SHORT_TERM_MAX_DAYS,
  SHORT_TERM_MIN_DAYS,
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
          id: 'exemptionPeriodTypeAlertMessage',
          alertType: 'info',
          title: exemptionPeriod.type.alertTitle,
          message: exemptionPeriod.type.alertMessage,
          condition: (answers) => {
            const exemptionPeriodType = getValueViaPath<ExemptionType>(
              answers,
              'exemptionPeriod.type',
            )
            return exemptionPeriodType === ExemptionType.LONG_TERM
          },
        }),
        buildDateField({
          id: 'exemptionPeriod.dateFrom',
          title: exemptionPeriod.period.dateFrom,
          width: 'half',
          required: true,
          placeholder: exemptionPeriod.period.datePlaceholder,
          condition: (answers) => {
            const exemptionType = getValueViaPath<ExemptionType>(
              answers,
              'exemptionPeriod.type',
            )
            return !!exemptionType
          },
          minDate: (application) => {
            const exemptionType = getValueViaPath<ExemptionType>(
              application.answers,
              'exemptionPeriod.type',
            )

            const dateToStr = getValueViaPath<string>(
              application.answers,
              'exemptionPeriod.dateTo',
            )
            const dateTo = dateToStr ? new Date(dateToStr) : new Date()

            const today = new Date()
            if (!dateTo) return today

            const offset =
              exemptionType === ExemptionType.SHORT_TERM
                ? SHORT_TERM_MAX_DAYS
                : LONG_TERM_MAX_DAYS

            const lowerBound = new Date(dateTo.getTime() - offset * MS_IN_DAY)

            return lowerBound > today ? lowerBound : today
          },
          maxDate: (application) => {
            const exemptionType = getValueViaPath<ExemptionType>(
              application.answers,
              'exemptionPeriod.type',
            )

            const dateToStr = getValueViaPath<string>(
              application.answers,
              'exemptionPeriod.dateTo',
            )
            const dateTo = dateToStr ? new Date(dateToStr) : undefined

            if (!dateTo) return undefined

            const offset =
              exemptionType === ExemptionType.SHORT_TERM
                ? SHORT_TERM_MIN_DAYS
                : LONG_TERM_MIN_DAYS

            const upperBound = new Date(dateTo.getTime() - offset * MS_IN_DAY)

            const today = new Date()
            return upperBound > today ? upperBound : today
          },
        }),
        buildDateField({
          id: 'exemptionPeriod.dateTo',
          title: exemptionPeriod.period.dateTo,
          width: 'half',
          required: true,
          placeholder: exemptionPeriod.period.datePlaceholder,
          condition: (answers) => {
            const exemptionType = getValueViaPath<ExemptionType>(
              answers,
              'exemptionPeriod.type',
            )
            return !!exemptionType
          },
          minDate: (application) => {
            const exemptionType = getValueViaPath<ExemptionType>(
              application.answers,
              'exemptionPeriod.type',
            )

            const dateFromStr = getValueViaPath<string>(
              application.answers,
              'exemptionPeriod.dateFrom',
            )
            const dateFrom = dateFromStr ? new Date(dateFromStr) : new Date()

            const offset =
              exemptionType === ExemptionType.SHORT_TERM
                ? SHORT_TERM_MIN_DAYS
                : LONG_TERM_MIN_DAYS

            return new Date(dateFrom.getTime() + offset * MS_IN_DAY)
          },
          maxDate: (application) => {
            const exemptionType = getValueViaPath<ExemptionType>(
              application.answers,
              'exemptionPeriod.type',
            )

            const dateFromStr = getValueViaPath<string>(
              application.answers,
              'exemptionPeriod.dateFrom',
            )
            const dateFrom = dateFromStr ? new Date(dateFromStr) : new Date()

            const offset =
              exemptionType === ExemptionType.SHORT_TERM
                ? SHORT_TERM_MAX_DAYS
                : LONG_TERM_MAX_DAYS

            return new Date(dateFrom.getTime() + offset * MS_IN_DAY)
          },
        }),
      ],
    }),
  ],
})
