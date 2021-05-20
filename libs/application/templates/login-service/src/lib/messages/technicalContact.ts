import { defineMessages } from 'react-intl'

export const technicalContact = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.technicalContact.pageTitle`,
      defaultMessage: 'Tæknilegur tengiliður',
      description: 'technicalContact page title',
    },
    pageDescription: {
      id: `ls.application:section.technicalContact.pageDescription`,
      defaultMessage:
        'Einstaklingur eða þjónustuaðili sem ber ábyrgð á uppsetningu innskráningarþjónustunnar',
      description: 'technicalContact page description',
    },
  }),
  labels: defineMessages({
    name: {
      id: `ls.application:section.technicalContact.name`,
      defaultMessage: 'Nafn tengiliðs',
      description: 'Technical contact name label',
    },
    email: {
      id: `ls.application:section.technicalContact.email`,
      defaultMessage: 'Netfang tengiliðs',
      description: 'Technical contact email label',
    },
    tel: {
      id: `ls.application:section.technicalContact.tel`,
      defaultMessage: 'Símanúmer tengiliðs',
      description: 'Technical contact tel label',
    },
    sameAsResponsibleParty: {
      id: `ls.application:section.technicalContact.sameAsResponsibleParty`,
      defaultMessage: 'Sami og ábyrgðaraðili',
      description: 'Technical contact sameAsResponsibleParty label',
    },  
    techAnnouncementsEmailTitle: {
      id: `ls.application:section.technicalContact.techAnnouncementsEmailTitle`,
      defaultMessage: 'Tæknilegar tilkynningar',
      description: 'Technical contact techAnnouncementsEmail title',
    },
    techAnnouncementsEmail: {
      id: `ls.application:section.technicalContact.techAnnouncementsEmail`,
      defaultMessage: 'Netfang fyrir tæknilegar tilkynningar',
      description: 'Technical contact techAnnouncementsEmail label',
    },
    techAnnouncementsEmailDescription: {
      id: `ls.application:section.technicalContact.techAnnouncementsEmailDescription`,
      defaultMessage:
        'Móttaka á tilkynningum vegna innskráningarþjónustunnar. Æskilegt er að móttaka tilkynninga fari á tækniborð eða þjónustuborð frekar en einstaklinga.',
      description: 'Technical contact techAnnouncementsEmailDescription',
    },
  }),
}
