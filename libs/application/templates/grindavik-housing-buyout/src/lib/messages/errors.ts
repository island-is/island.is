import { defineMessages } from 'react-intl'

export const errors = {
  fields: defineMessages({
    required: {
      id: 'ghb.application:errors.contacts.required',
      defaultMessage: 'Þennan reit þarf að fylla út',
      description: 'Error message a required field is empty',
    },
    requiredCheckbox: {
      id: 'ghb.application:errors.contacts.requiredCheckbox',
      defaultMessage: 'Vantar samþykki',
      description: 'Error message a required checkbox is not checked',
    },
  }),
}
