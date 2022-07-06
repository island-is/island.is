import { defineMessages } from 'react-intl'

export const technicalAnnouncements = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.technicalAnnouncements.pageTitle`,
      defaultMessage: 'Tæknilegar tilkynningar',
      description: 'technicalAnnouncements page title',
    },
    pageDescription: {
      id: `ls.application:section.technicalAnnouncements.pageDescription`,
      defaultMessage:
        'Móttaka á tilkynningum vegna innskráningarþjónustunnar. Æskilegt er að móttaka tilkynninga fari á tækniborð eða þjónustuborð frekar en einstaklinga.',
      description: 'technicalAnnouncements page description',
    },
  }),
  labels: defineMessages({
    email: {
      id: `ls.application:section.technicalAnnouncements.email`,
      defaultMessage: 'Netfang fyrir tæknilegar tilkynningar',
      description: 'Technical Announcements email label',
    },
    tel: {
      id: `ls.application:section.technicalAnnouncements.tel`,
      defaultMessage: 'Símanúmer fyrir tæknilegar tilkynningar',
      description: 'Technical Announcements tel label',
    },
    type: {
      id: `ls.application:section.technicalAnnouncements.type`,
      defaultMessage: 'Tegund þjónustu',
      description: 'Technical Announcements type label',
    },
    typePlaceholder: {
      id: `ls.application:section.technicalAnnouncements.typePlaceholder`,
      defaultMessage: 'Dæmi: Mínar síður',
      description: 'Technical Announcements typePlaceholder label',
    },
  }),
}
