import { defineMessages } from 'react-intl'

export const locationAndPurpose = {
  general: defineMessages({
    title: {
      id: 'an.application:locationAndPurpose.general.title',
      defaultMessage: 'Staðsetning og tilgangur',
      description: 'Location and purpose',
    },
    description: {
      id: 'an.application:locationAndPurpose.general.description',
      defaultMessage:
        'Vinsamlegast skráðu staðsetninguna þar sem atvikið átti sér stað og gefðu stutta lýsingu á hvers vegna þú varst þar.',
      description: `Please list the location where the incident took place and give a brief description of why you were there.`,
    },
  }),
  labels: defineMessages({
    location: {
      id: 'an.application:locationAndPurpose.labels.descriptionField',
      defaultMessage: 'Staðsetning / póstnúmer',
      description: `Location / postal code`,
    },
  }),
}
