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
    otherLoanProviders: {
      id: 'ghb.application:errors.otherLoanProviders',
      defaultMessage:
        'Skylda er að annaðhvort fylla út stöðu lána hér fyrir ofan eða staðfesta að þú sért með lán frá öðrum lánveitanda',
      description: 'Error message when no loan providers are added',
    },
  }),
}
