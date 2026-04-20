import { defineMessages } from 'react-intl'

export const locationAndPurpose = {
  general: defineMessages({
    title: {
      id: 'an.application:locationAndPurpose.general.title',
      defaultMessage: 'Staðsetning',
      description: 'Location and purpose',
    },
    description: {
      id: 'an.application:locationAndPurpose.general.description',
      defaultMessage:
        'Vinsamlegast tilgreindu eins nákvæma staðsetningu og hægt er þar sem atvikið átti sér stað.',
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
