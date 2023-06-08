import { defineMessages } from 'react-intl'

export const homeCircumstancesForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.homeCircumstancesForm.general.sectionTitle',
      defaultMessage: 'Búseta',
      description: 'Home circumstances form section title',
    },
    pageTitle: {
      id: 'fa.application:section.homeCircumstancesForm.general.pageTitle',
      defaultMessage: 'Hvað lýsir búsetu þinni best?',
      description: 'Home circumstances form page title',
    },
  }),
  circumstances: defineMessages({
    withParents: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.withParents',
      defaultMessage: 'Ég bý hjá foreldrum',
      description:
        'Home circumstances form circumstances if applicant is living with parents',
    },
    withOthers: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.withOthers',
      defaultMessage: 'Ég bý eða leigi hjá öðrum án leigusamnings',
      description:
        'Home circumstances form circumstances if applicant lives with others',
    },
    ownPlace: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.ownPlace',
      defaultMessage: 'Ég bý í eigin húsnæði',
      description:
        'Home circumstances form circumstances if applicant has its own place',
    },
    registeredLease: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.registeredLease',
      defaultMessage: 'Ég leigi með þinglýstan leigusamning',
      description:
        'Home circumstances form circumstances if applicant has registered lease',
    },
    unregisteredLease: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.unregisteredLease',
      defaultMessage: 'Ég leigi með óþinglýstan leigusamning',
      description:
        'Home circumstances form circumstances if applicant has unregistered lease',
    },
    other: {
      id: 'fa.application:section.homeCircumstancesForm.circumstances.other',
      defaultMessage: 'Annað',
      description: 'If home circumstances dont apply to applicant',
    },
  }),
}
