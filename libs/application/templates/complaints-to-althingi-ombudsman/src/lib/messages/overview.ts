import { defineMessages } from 'react-intl'

export const complaintOverview = {
  general: defineMessages({
    noAttachments: {
      id: 'ctao.application:overview.noAttachments',
      defaultMessage: 'Engin fylgiskjöl',
      description:
        'Fallback text to display in overview when there are no attachments',
    },
  }),
  labels: defineMessages({
    nationalRegistry: {
      id: 'ctao.application:overview.label.nationalRegistry',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Label for national registry',
    },
    nationalRegistryText: {
      id: 'ctao.application:overview.label.nationalRegistryText',
      defaultMessage: 'Nafn, kennitala, símanúmer, netfang',
      description: 'Text for national registry',
    },
    notificationConsentTitle: {
      id: 'ctao.application:overview.label.notificationConsentTitle',
      defaultMessage: 'Samþykki fyrir tilkynningar',
      description: 'Title for notification consent',
    },
    notificationConsentText: {
      id: 'ctao.application:overview.label.notificationConsentText',
      defaultMessage: 'Send verða til þín skilaboð um stöðu mála osfrv.',
      description: 'Text for notification consent',
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
      defaultMessage: 'Rökstuðningur kvörtunar og önnur fylgiskjöl',
      description: 'Label for attachments',
    },
    complaintDescription: {
      id: 'ctao.application:overview.label.complaintDescription',
      defaultMessage: 'Lýsing kvörtunar',
      description: 'Label for complaint description',
    },
    decisionDate: {
      id: 'ctao.application:overview.label.decisionDate',
      defaultMessage: 'Dagsetning ákvörðunar',
      description: 'Label for decision date',
    },
    complaintType: {
      id: 'ctao.application:overview.label.complaintType',
      defaultMessage: 'Kvörtunin varðar',
      description: 'Label for complaint type',
    },
  }),
}
