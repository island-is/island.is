import { defineMessages } from 'react-intl'

export const homeCircumstancesForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.homeCircumstancesForm.general.sectionTitle',
      defaultMessage: 'Búseta',
      description: 'Home circumstances form Page Title',
    },
    pageTitle: {
      id: 'fa.application:section.homeCircumstancesForm.general.pageTitle',
      defaultMessage: 'Hvað lýsir búsetu þinni best?',
      description: 'About form page title',
    },
    inputLabel: {
      id: 'fa.application:section.homeCircumstancesForm.general.inputLabel',
      defaultMessage: 'Lýstu þínum aðstæðum',
      description: 'About form page description',
    },
  }),
  circumstances: defineMessages({
    WithParents: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.WithParents',
      defaultMessage: 'Ég bý hjá foreldrum',
      description: 'Home circumstances form circumstances',
    },
    WithOthers: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.WithOthers',
      defaultMessage: 'Ég bý eða leigi hjá öðrum án leigusamnings',
      description: 'Home circumstances form circumstances',
    },
    OwnPlace: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.OwnPlace',
      defaultMessage: 'Ég bý í eigin húsnæði',
      description: 'Home circumstances form circumstances',
    },
    RegisteredLease: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.RegisteredLease',
      defaultMessage: 'Ég leigi með þinglýstan leigusamning',
      description: 'Home circumstances form circumstances',
    },
    UnregisteredLease: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.UnregisteredLease',
      defaultMessage: 'Ég leigi með óþinglýstan leigusamning',
      description: 'Home circumstances form circumstances',
    },
    Other: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.Other',
      defaultMessage: 'Annað',
      description: 'Home circumstances form circumstances',
    },
  }),
}
