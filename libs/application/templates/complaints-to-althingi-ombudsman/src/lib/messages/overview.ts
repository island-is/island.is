import { defineMessages } from 'react-intl'

export const complaintOverview = {
  general: defineMessages({
    title: {
      id: 'ctao.application:overview.general.title',
      defaultMessage: 'Kvörtun og undirritun',
      description: 'Overview of application',
    },
    noAttachments: {
      id: 'ctao.application:overview.noAttachments',
      defaultMessage: 'Engin fylgiskjöl',
      description:
        'Fallback text to display in overview when there are no attachments',
    },
  }),
  labels: defineMessages({
    externalDataTitle: {
      id: 'ctao.application:overview.label.externalDataTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Label for external data usage',
    },
    externalDataText: {
      id: 'ctao.application:overview.label.externalDataText',
      defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
      description: 'Text for external data usage',
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
    courtActionSecond: {
      id: 'ctao.application:overview.label.courtActionSecond',
      defaultMessage: 'Hefur málið verið lagt fyrir dómstóla?',
      description: 'Label for the court action second answer',
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
    submit: {
      id: 'ctao.application:overview.labels.submit',
      defaultMessage: 'Staðfesta',
      description: 'Submit button text',
    },
    complaintDocument: {
      id: 'ctao.application:overview.labels.complaintDocument',
      defaultMessage: 'Kvörtun',
      description: 'Complaint document label',
    },
    complaintNoDocuments: {
      id: 'ctao.application:overview.labels.complaintNoDocuments',
      defaultMessage: 'Engum fylgiskjölum var skilað',
      description: 'No Complaint document label',
    },
    complainedForDocument: {
      id: 'ctao.application:overview.labels.complainedForDocument',
      defaultMessage: 'Umboð frá kvörtunaraðila',
      description: 'Complained for document label',
    },
  }),
}
