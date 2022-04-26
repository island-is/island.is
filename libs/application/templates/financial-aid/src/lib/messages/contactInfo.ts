import { defineMessages } from 'react-intl'

export const contactInfo = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.contactInfo.general.sectionTitle',
      defaultMessage: 'Samskipti',
      description: 'Contact info section title',
    },
    pageTitle: {
      id: 'fa.application:section.contactInfo.general.pageTitle',
      defaultMessage: 'Samskipti',
      description: 'Contact info page title',
    },
    description: {
      id: 'fa.application:section.contactInfo.general.description',
      defaultMessage:
        'Vinsamlegast sláðu inn netfang þitt og símanúmer svo öll samskipti milli þín og sveitarfélagsins gangi greiðlega fyrir sig í umsóknarferlinu.',
      description: 'Contact info description',
    },
  }),
  emailInput: defineMessages({
    label: {
      id: 'fa.application:section.contactInfo.emailInput.label',
      defaultMessage: 'Netfang',
      description: 'Contact info email input label',
    },
    placeholder: {
      id: 'fa.application:section.contactInfo.emailInput.placeholder',
      defaultMessage: 'Sláðu inn netfang',
      description: 'Contact info email input placeholder',
    },
  }),
  phoneInput: defineMessages({
    label: {
      id: 'fa.application:section.contactInfo.phoneInput.label',
      defaultMessage: 'Símanúmer',
      description: 'Contact info phone input label',
    },
    placeholder: {
      id: 'fa.application:section.contactInfo.phoneInput.placeholder',
      defaultMessage: 'Sláðu inn símanúmer',
      description: 'Contact info phone input placeholder',
    },
  }),
}
