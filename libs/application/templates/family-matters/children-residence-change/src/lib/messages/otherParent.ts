import { defineMessages } from 'react-intl'

// Confirm other parent
export const otherParent = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.backgroundInformation.otherParent.sectionTitle',
      defaultMessage: 'Staðfesta foreldri',
      description: 'Other parent section title',
    },
    pageTitle: {
      id: 'crc.application:section.backgroundInformation.otherParent.pageTitle',
      defaultMessage: 'Staðfestu upplýsingar um hitt foreldrið',
      description: 'Other parent page title',
    },
    intro: {
      id: 'crc.application:section.backgroundInformation.otherParent.intro',
      defaultMessage: 'Hitt foreldrið er {parentName} ({parentSSN})',
      description: 'Other parent page intro',
    },
    description: {
      id: 'crc.application:section.backgroundInformation.otherParent.description',
      defaultMessage:
        'Til að afla samþykkis hins foreldrisins þurfum við að fá netfang og símanúmer viðkomandi.',
      description: 'Other parent page description',
    },
  }),
  inputs: defineMessages({
    emailLabel: {
      id: 'crc.application:section.backgroundInformation.otherParent.inputs.emailLabel',
      defaultMessage: 'Netfang',
      description: 'Email label',
    },
    phoneNumberLabel: {
      id: 'crc.application:section.backgroundInformation.otherParent.inputs.phoneNumberLabel',
      defaultMessage: 'Símanúmer',
      description: 'Phone number label',
    },
  }),
}
