import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  coreMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'
import { doYouHaveVacationDays } from '../../../utils'
import { getVacationDaysLimit } from '../../../utils/getVacationDaysLimit'

export const vacationSubSection = buildSubSection({
  id: 'vacationSubSection',
  title: payoutMessages.vacation.sectionTitle,
  children: [
    buildMultiField({
      id: 'vacationSubSection',
      title: payoutMessages.vacation.pageTitle,
      children: [
        buildAlertMessageField({
          id: 'vacationAlert',
          message: payoutMessages.vacation.vacationAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: 'haveVacationQuestion',
          title: payoutMessages.vacation.haveVacationQuestion,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'vacation.doYouHaveVacationDays',
          width: 'half',
          space: 0,
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'explainVacationLabel',
          title: payoutMessages.vacation.explainVacationLabel,
          message: payoutMessages.vacation.explainVacationDescription,
          condition: doYouHaveVacationDays,
          alertType: 'info',
        }),
        buildFieldsRepeaterField({
          id: 'vacation.vacationDays',
          minRows: 1,
          formTitleNumbering: 'none',
          marginTop: 0,
          condition: doYouHaveVacationDays,
          fields: {
            amount: {
              component: 'input',
              label: payoutMessages.vacation.vacationDaysLabel,
              width: 'full',
              type: 'number',
              min: 0,
              required: true,
            },
            startDate: {
              component: 'date',
              label: payoutMessages.vacation.dateStart,
              width: 'half',
              required: true,
              minDate: new Date(),
              maxDate: () => {
                const beforeLimit = getVacationDaysLimit()
                const max = beforeLimit
                  ? new Date(new Date().getFullYear(), 8, 15) // September 15th this year
                  : new Date(new Date().getFullYear() + 1, 8, 15) // September 15th next year

                return max
              },
            },
            endDate: {
              component: 'date',
              label: payoutMessages.vacation.dateEnd,
              width: 'half',
              required: true,
              minDate: new Date(),
              maxDate: () => {
                const beforeLimit = getVacationDaysLimit()
                const max = beforeLimit
                  ? new Date(new Date().getFullYear(), 8, 15) // September 15th this year
                  : new Date(new Date().getFullYear() + 1, 8, 15) // September 15th next year

                return max
              },
            },
          },
        }),
        buildCustomField({
          id: 'vacation.validation',
          component: 'VacationValidation',
        }),
      ],
    }),
  ],
})
