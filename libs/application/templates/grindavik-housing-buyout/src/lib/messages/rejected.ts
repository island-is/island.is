import { defineMessages } from 'react-intl'

export const rejected = defineMessages({
  sectionTitle: {
    id: 'ghb.application:rejected.sectionTitle',
    defaultMessage: 'Umsókn hafnað',
    description: 'Title of the rejected section',
  },
  text: {
    id: 'ghb.application:rejected.text',
    defaultMessage:
      'Hér ætti kannski að koma einhver texti um hvað notandi getur gert nú þegar umsókn hefur verið hafnað. Líklega er einhver hlekkur hér á [vefsíðu sýslumanns](https://island.is/s/syslumenn/sudurnes).',
    description: 'Text of the section when the application is rejected',
  },
})
