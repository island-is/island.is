import { defineMessages } from 'react-intl'

export const seminar = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:seminar.general.pageTitle',
      defaultMessage: 'Skráning á námskeið',
      description: `seminar page title `,
    },
    sectionTitle: {
      id: 'aosh.sem.application:seminar.general.sectionTitle',
      defaultMessage: 'Námskeið',
      description: `seminar section title `,
    },
    pageDescription: {
      id: 'aosh.sem.application:seminar.general.pageDescription',
      defaultMessage: 'Upplýsingar um námskeiðið sem þú ert að fara að skrá á.',
      description: `seminar page description `,
    },
  }),

  labels: defineMessages({
    seminarType: {
      id: 'aosh.sem.application:seminar.labels.seminarType',
      defaultMessage: 'Tegund:',
      description: `seminar type label `,
    },
    seminarPrice: {
      id: 'aosh.sem.application:seminar.labels.seminarPrice',
      defaultMessage: 'Verð:',
      description: `seminar price label `,
    },
    seminarBegins: {
      id: 'aosh.sem.application:seminar.labels.seminarBegins',
      defaultMessage: 'Hefst:',
      description: `seminar begins label `,
    },
    seminarEnds: {
      id: 'aosh.sem.application:seminar.labels.seminarEnds',
      defaultMessage: 'Lýkur:',
      description: `seminar ends label `,
    },
    seminarOpens: {
      id: 'aosh.sem.application:seminar.labels.seminarOpens',
      defaultMessage: 'Við skráningu',
      description: `seminar opens label `,
    },
    openForWeeks: {
      id: 'aosh.sem.application:seminar.labels.openForWeeks',
      defaultMessage: 'Er opið í 8 vikur frá skráningu',
      description: `seminar open for weeks label `,
    },
    seminarDescription: {
      id: 'aosh.sem.application:seminar.labels.seminarDescription',
      defaultMessage: 'Lýsing:',
      description: `seminar description label `,
    },
    seminarDescriptionUrlText: {
      id: 'aosh.sem.application:seminar.labels.seminarDescriptionUrlText',
      defaultMessage: '[Sjá námskeiðslýsingu hér]({url})',
      description: `seminar description label `,
    },
    seminarLocation: {
      id: 'aosh.sem.application:seminar.labels.seminarLocation',
      defaultMessage: 'Staðsetning:',
      description: `seminar location label `,
    },
  }),
}
