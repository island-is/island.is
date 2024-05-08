import { defineMessages } from 'react-intl'

export const errors = {
  fields: defineMessages({
    required: {
      id: 'hid.application:errors.contacts.required',
      defaultMessage: 'Þennan reit þarf að fylla út',
      description: 'Error message a required field is empty',
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
