import { defineMessages } from 'react-intl'

export const errors = {
  fields: defineMessages({
    required: {
      id: 'hid.application:errors.contacts.required',
      defaultMessage: 'Þennan reit þarf að fylla út',
      description: 'Error message a required field is empty',
    },
    endDateBeforeStart: {
      id: 'hid.application:errors.fields.endDateBeforeStart',
      defaultMessage: 'Loka dagsetning má ekki vera fyrir upphafs dagsetningu',
      description: 'End date before start date error message',
    },
    startDateAfterEnd: {
      id: 'hid.application:errors.fields.startDateAfterEnd',
      defaultMessage: 'Upphafs dagsetning má ekki vera eftir loka dagsetningu',
      description: 'Start date after end date error message',
    },
    noSelectedApplicant: {
      id: 'hid.application:errors.fields.noSelectedApplicant',
      defaultMessage:
        'Að minnsta kosti einn aðlili þarf að vera valinn svo hægt sé að sækja um yfirlýsingu',
      description: 'No selected applicant error message',
    },
  }),
  submitted: defineMessages({
    externalError: {
      id: 'hid.application:errors.submitter.externalError',
      defaultMessage: 'Ekki náðist samband við þjónustu',
      description: 'Error message when external error occurs',
    },
  }),
}
