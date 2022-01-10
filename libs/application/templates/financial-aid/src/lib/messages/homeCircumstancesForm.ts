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
      description: 'Home circumstances form page title',
    },
    inputLabel: {
      id: 'fa.application:section.homeCircumstancesForm.general.inputLabel',
      defaultMessage: 'Lýstu þínum aðstæðum',
      description: 'Home circumstances custom form input label',
    },
  }),
  circumstances: defineMessages({
    withParents: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.WithParents',
      defaultMessage: 'Ég bý hjá foreldrum',
      description:
        'Home circumstances form circumstances if applicant is living with parents',
    },
    withOthers: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.WithOthers',
      defaultMessage: 'Ég bý eða leigi hjá öðrum án leigusamnings',
      description:
        'Home circumstances form circumstances if applicant lives with others',
    },
    ownPlace: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.OwnPlace',
      defaultMessage: 'Ég bý í eigin húsnæði',
      description:
        'Home circumstances form circumstances if applicant has its own place',
    },
    registeredLease: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.RegisteredLease',
      defaultMessage: 'Ég leigi með þinglýstan leigusamning',
      description:
        'Home circumstances form circumstances if applicant has registered lease',
    },
    unregisteredLease: {
      id:
        'fa.application:section.homeCircumstancesForm.circumstances.UnregisteredLease',
      defaultMessage: 'Ég leigi með óþinglýstan leigusamning',
      description:
        'Home circumstances form circumstances if applicant has unregistered lease',
    },
    other: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.Other',
      defaultMessage: 'Annað',
      description: 'If home circumstances dont apply to applicant  ',
    },
  }),
}
