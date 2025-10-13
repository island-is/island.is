import { defineMessages } from 'react-intl'

export const reportingObligation = defineMessages({
  pageTitle: {
    id: 'aa.application:reportingObligation.pageTitle',
    defaultMessage: 'Tilkynningarskylda',
    description: `reporting obligation page title`,
  },
  subTitle: {
    id: 'aa.application:reportingObligation.subTitle',
    defaultMessage: 'Þú þarft að láta okkur vita ef þú:',
    description: 'reporting obligation sub title',
  },
  description: {
    id: 'aa.application:reportingObligation.description#markdown',
    defaultMessage: `* Skiptir um heimilisfang, símanúmer eða netfang
    \n* Byrjar að vinna eða tekur að þér tilfallandi vinnu
    \n* Ferð eða flytur til útlanda
    \n* Að vera vinnufær
    \n* Að vera reiðubúin/n/ð að ráða sig til almennra starfa`,
    description: 'reporting obligation for the application, in markdown format',
  },
  checkboxText: {
    id: 'aa.application:reportingObligation.checkboxText',
    defaultMessage: 'Ég skil',
    description: 'reporting obligation checkbox text',
  },
  secondSubTitle: {
    id: 'aa.application:reportingObligation.secondSubTitle',
    defaultMessage:
      'Breytingar á högum, vinna og ferðir erlendis eru tilkynntar á Mínum síðum Vinnumálastofnunar.',
    description: 'reporting obligation second subtitle',
  },
  alertInfoTitle: {
    id: 'aa.application:reportingObligation.alertInfoTitle',
    defaultMessage: 'Athugið',
    description: 'reporting obligation alert info title',
  },
  alertInfoMessage: {
    id: 'aa.application:reportingObligation.alertInfoMessage',
    defaultMessage:
      'Skyldumæting er í öll viðtöl, fundi og önnur úrræði sem Vinnumálastofnun boðar þig í.',
    description: 'reporting obligation alert info message',
  },
})
