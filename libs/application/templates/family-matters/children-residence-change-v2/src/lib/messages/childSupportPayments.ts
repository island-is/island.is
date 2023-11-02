import { defineMessages } from 'react-intl'

export const childSupportPayments = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.childSupportPayment.sectionTitle',
      defaultMessage: 'Framfærsla og meðlag',
      description: 'Child support payments section title',
    },
    description: {
      id: 'crc.application:section.arrangement.childSupportPayment.description#markdown',
      defaultMessage:
        'Báðum foreldrum er skylt að framfæra barn sitt.\n\nSamningurinn tekur gildi þann dag sem sýslumaður staðfestir samninginn.\n\nVinsamlegast gerið grein fyrir því hvernig framfærslu er háttað af því foreldri sem barnið býr ekki hjá:',
      description: 'Child support payments page description',
    },
    infoText: {
      id: 'crc.application:section.arrangement.childSupportPayment.infoText#markdown',
      defaultMessage:
        'Ef foreldrar óska þess að gera samning um meðlag með öðrum hætti en hér greinir, vinsamlegast snúið ykkur til sýslumanns.',
      description: 'Child support payments page info text',
    },
    alert: {
      id: 'crc.application:section.arrangement.childSupportPayment.alert',
      defaultMessage:
        'Ef um samkomulag um framfærslu er að ræða þá er hvorki hægt að krefjast milligöngu Tryggingastofnunar eða krefjast fjarnáms fyrir meðlagsgreiðslum.',
      description: 'Child support payments page alert',
    },
  }),
  radioAgreement: defineMessages({
    title: {
      id: 'crc.application:section.arrangement.childSupportPayment.radioAgreement.title',
      defaultMessage: 'Samkomulag er um framfærslu',
      description: 'Agreement radio title',
    },
    description: {
      id: 'crc.application:section.arrangement.childSupportPayment.radioAgreement.description',
      defaultMessage: 'Ekki verður af greiðslu hefðbundins meðlags',
      description: 'Agreement radio description',
    },
  }),
  radioChildSupport: defineMessages({
    title: {
      id: 'crc.application:section.arrangement.childSupportPayment.radioChildSupport.title',
      defaultMessage: 'Greiðsla meðlags',
      description: 'Child support radio title',
    },
    description: {
      id: 'crc.application:section.arrangement.childSupportPayment.radioChildSupport.description',
      defaultMessage:
        'Umgengnisforeldri samþykkir að greiða einfalt meðlag með barninu til 18 ára aldurs þess eða á meðan samningurinn gildir.',
      description: 'Child support radio description',
    },
  }),
}
