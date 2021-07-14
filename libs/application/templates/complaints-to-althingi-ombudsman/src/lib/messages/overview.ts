import { defineMessages } from 'react-intl'

export const complaintOverview = {
  labels: defineMessages({
    nationalRegistry: {
      id: 'ctao.application:overview.label.nationalRegistry',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Label for national registry',
    },
    complainedFor: {
      id: 'ctao.application:overview.label.complainedFor',
      defaultMessage: 'Kvartað fyrir',
      description: 'Label for complained for',
    },
    complainedForConnection: {
      id: 'ctao.application:overview.label.complainedFor.connection',
      defaultMessage: 'Tengsl við þann aðila',
      description: 'Label for complained for connection',
    },
    complainee: {
      id: 'ctao.application:overview.label.complainee',
      defaultMessage: 'Kvörtun beinist að',
      description: 'Label for complainee',
    },
    complaineeName: {
      id: 'ctao.application:overview.label.complaineeName',
      defaultMessage: 'Nafn stjórnvalds',
      description: 'Label for complainee name',
    },
    courtAction: {
      id: 'ctao.application:overview.label.courtAction',
      defaultMessage: 'Lagt fyrir dómstóla',
      description: 'Label for the court action answer',
    },
    powerOfAttorney: {
      id: 'ctao.application:overview.label.powerOfAttorney',
      defaultMessage: 'Umboð frá kvörtunaraðila',
      description: 'Label for power of attorney',
    },
    attachments: {
      id: 'ctao.application:overview.label.attachments',
      defaultMessage: 'Fylgiskjöl',
      description: 'Label for attachments',
    },
  }),
}
