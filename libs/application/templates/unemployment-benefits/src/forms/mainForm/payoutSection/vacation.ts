import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  coreMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'
import { doYouHaveVacationDays } from '../../../utils'

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
        buildDescriptionField({
          id: 'explainVacationLabel',
          title: payoutMessages.vacation.explainVacationLabel,
          titleVariant: 'h5',
          marginTop: 2,
          condition: doYouHaveVacationDays,
        }),
        buildTextField({
          id: 'vacation.amount',
          title: payoutMessages.vacation.vacationDaysLabel,
          variant: 'number',
          condition: doYouHaveVacationDays,
        }),
        buildFieldsRepeaterField({
          id: 'vacation.vacationDays',
          minRows: 1,
          formTitleNumbering: 'none',
          marginTop: 0,
          condition: doYouHaveVacationDays,
          fields: {
            //TODO bæði startDate og endDate eru bara frammí tímann
            startDate: {
              component: 'date',
              label: payoutMessages.vacation.dateStart,
              width: 'half',
            },
            endDate: {
              component: 'date',
              label: payoutMessages.vacation.dateEnd,
              width: 'half',
            },
          },
        }),
      ],
    }),
  ],
})
