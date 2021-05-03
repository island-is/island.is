import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const technicalContact = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.technicalContact.pageTitle`,
      defaultMessage: 'Tæknilegur tengiliður',
      description: 'technicalContact page title',
    },
    pageDescription: {
      id: `${t}:section.technicalContact.pageDescription`,
      defaultMessage:
        'Einstaklingur eða þjónustuaðili sem tekur á móti tæknilegum vandamálum.',
      description: 'technicalContact page description',
    },
  }),
  labels: defineMessages({
    name: {
      id: `${t}:section.technicalContact.name`,
      defaultMessage: 'Nafn á tæknilegum tengiliði',
      description: 'Technical contact name label',
    },
    email: {
      id: `${t}:section.technicalContact.email`,
      defaultMessage: 'Netfang tæknilegs tengiliðs',
      description: 'Technical contact email label',
    },
    tel: {
      id: `${t}:section.technicalContact.tel`,
      defaultMessage: 'Símanúmer tæknilegs tengiliðs',
      description: 'Technical contact tel label',
    },
    sameAsResponsibleParty: {
      id: `${t}:section.technicalContact.sameAsResponsibleParty`,
      defaultMessage: 'Sami og ábyrgðaraðili',
      description: 'Technical contact sameAsResponsibleParty label',
    },
    techAnnouncementsEmail: {
      id: `${t}:section.technicalContact.techAnnouncementsEmail`,
      defaultMessage: 'Netfang fyrir tæknilegar tilkynningar',
      description: 'Technical contact techAnnouncementsEmail label',
    },
    techAnnouncementsEmailDescription: {
      id: `${t}:section.technicalContact.techAnnouncementsEmailDescription`,
      defaultMessage:
        'Ath: Þetta má ekki vera persóna, þarf að vera tækniborð/NOC eða sambærilegt',
      description: 'Technical contact techAnnouncementsEmailDescription',
    },
  }),
}
