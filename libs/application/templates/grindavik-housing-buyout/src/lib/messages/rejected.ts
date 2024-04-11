import { defineMessages } from 'react-intl'

export const rejected = defineMessages({
  sectionTitle: {
    id: 'ghb.application:rejected.sectionTitle',
    defaultMessage: 'Umsókn hafnað',
    description: 'Title of the rejected section',
  },
  text: {
    id: 'ghb.application:rejected.text#markdown',
    defaultMessage:
      'Umsókn þinni um kaup ríkis á íbúðarhúsnæði í Grindavík hefur verið hafnað.',
    description: 'Text of the section when the application is rejected',
  },
})
