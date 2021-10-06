import { defineMessages } from 'react-intl'

export const fishingLocationAndPurpose = {
  general: defineMessages({
    title: {
      id: 'an.application:locationAndPurpose.general.title',
      defaultMessage: 'Staðsetning',
      description: 'Location and purpose',
    },
    description: {
      id: 'an.application:locationAndPurpose.general.description',
      defaultMessage:
        'Vinsamlegast skráðu eins nákvæma staðsetningu þar sem atvikið átti sér stað.',
      description: `Please list the location where the incident took place and give a brief description of why you were there.`,
    },
  }),
  labels: defineMessages({
    location: {
      id: 'an.application:locationAndPurpose.labels.descriptionField',
      defaultMessage: 'Staðsetning / póstfang',
      description: `Location / email`,
    },
  }),
}
