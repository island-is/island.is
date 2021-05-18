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
        'Einstaklingur eða þjónustuaðili sem tekur á móti tæknilegum vandamálum.',
      description: 'technicalContact page description',
    },
  }),
  labels: defineMessages({
    name: {
      id: `ls.application:section.technicalContact.name`,
      defaultMessage: 'Nafn á tæknilegum tengiliði',
      description: 'Technical contact name label',
    },
    email: {
      id: `ls.application:section.technicalContact.email`,
      defaultMessage: 'Netfang tæknilegs tengiliðs',
      description: 'Technical contact email label',
    },
    tel: {
      id: `ls.application:section.technicalContact.tel`,
      defaultMessage: 'Símanúmer tæknilegs tengiliðs',
      description: 'Technical contact tel label',
    },
    sameAsResponsibleParty: {
      id: `ls.application:section.technicalContact.sameAsResponsibleParty`,
      defaultMessage: 'Sami og ábyrgðaraðili',
      description: 'Technical contact sameAsResponsibleParty label',
    },
    techAnnouncementsEmail: {
      id: `ls.application:section.technicalContact.techAnnouncementsEmail`,
      defaultMessage: 'Netfang fyrir tæknilegar tilkynningar',
      description: 'Technical contact techAnnouncementsEmail label',
    },
    techAnnouncementsEmailDescription: {
      id: `ls.application:section.technicalContact.techAnnouncementsEmailDescription`,
      defaultMessage:
        'Ath: Þetta má ekki vera persóna, þarf að vera tækniborð/NOC eða sambærilegt',
      description: 'Technical contact techAnnouncementsEmailDescription',
    },
  }),
}
