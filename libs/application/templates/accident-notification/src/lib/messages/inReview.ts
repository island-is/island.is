import { defineMessages } from 'react-intl'

export const inReview = {
  general: defineMessages({
    formTitle: {
      id: 'an.application:inReview.general.formTitle',
      defaultMessage: 'Tilkynning um slys',
      description: 'In review form title',
    },
    title: {
      id: 'an.application:inReview.general.titleInReview',
      defaultMessage: 'Staða tilkynningar',
      description: 'Your application is in review',
    },
    viewApplicationButton: {
      id: 'an.application:inReview.general.viewApplicationButton',
      defaultMessage: 'Skoða tilkynningu',
      description:
        'A button to view application located in application state screen',
    },
  }),
  tags: defineMessages({
    missing: {
      id: 'an.application:inReview.tags.missingDocuments',
      defaultMessage: 'Vantar',
      description: 'Missing',
    },
    approved: {
      id: 'an.application:inReview.tags.approved',
      defaultMessage: 'Samþykkt',
      description: 'Approved',
    },
    pending: {
      id: 'an.application:inReview.tags.pending',
      defaultMessage: 'Í bið',
      description: 'Pending',
    },
    received: {
      id: 'an.application:inReview.tags.received',
      defaultMessage: 'Móttekið',
      description: 'Received',
    },
    objected: {
      id: 'an.application:inReview.tags.objected',
      defaultMessage: 'Andmælt',
      description: 'Objected',
    },
  }),
  application: defineMessages({
    title: {
      id: 'an.application:inReview.application.title',
      defaultMessage: 'Slysatilkynning',
      description: 'Title for application section in review',
    },
    summary: {
      id: 'an.application:inReview.application.summary',
      defaultMessage:
        'Slysatilkynning hefur verið send til Sjúkratryggingar Íslands',
      description: 'Summary for application section in review',
    },
    documentIdAlertTitle: {
      id: 'an.application:inReview.application.documentIdAlertTitle',
      defaultMessage: 'Skjalanúmer',
      description: 'Document Id',
    },
    documentIdAlertMessage: {
      id: 'an.application:inReview.application.documentIdAlertMessage',
      defaultMessage:
        'Skjalanúmer fyrir tilkynninguna hjá Sjúkratryggingum Íslands:',
      description: 'Document id description text',
    },
  }),
  documents: defineMessages({
    title: {
      id: 'an.application:inReview.documents.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Title for documents section in review',
    },
    summary: {
      id: 'an.application:inReview.documents.summary',
      defaultMessage:
        'Til þess að Sjúkratryggingar Íslands geti hafið vinnslu slysatilkynningar þurfa viðeigandi gögn að berast.',
      description: 'Summary for documents section in review',
    },
    summaryApproved: {
      id: 'an.application:inReview.documents.summaryApproved',
      defaultMessage: 'Nauðsynleg gögn móttekin',
      description: 'Summary for documents section in review',
    },
  }),
  representative: defineMessages({
    title: {
      id: 'an.application:inReview.representative.title',
      defaultMessage: 'Yfirferð og staðfesting',
      description: 'Title for representative section in review',
    },
    summary: {
      id: 'an.application:inReview.representative.summary',
      defaultMessage:
        'Ef slysið átti sér stað á vinnustað/skóla/stofnun/íþróttafélagi þá þarf forsvarsmaður þess að yfirfara og staðfesta upplýsingar í tilkynningu.',
      description: 'Summary for representative section in review',
    },
  }),
  sjukratrygging: defineMessages({
    title: {
      id: 'an.application:inReview.sjukratrygging.title',
      defaultMessage: 'Afstaða til bótastöðu',
      description: 'Title for sjukratrygging section in review',
    },
    summary: {
      id: 'an.application:inReview.sjukratrygging.summary',
      defaultMessage:
        'Þegar öll nauðsynleg gögn hafa borist, fer Sjúkratryggingar Íslands yfir umsókn og er þá afstaða tekin til bótaskyldu.',
      description: 'Summary for sjukratrygging section in review',
    },
  }),
  infoMessages: defineMessages({
    applicationUpdated: {
      id: 'an.application:inReview.infoMessages.applicationUpdated',
      defaultMessage: 'Tilkynning uppfærð',
      description: 'Message to user when application has been updated',
    },
  }),
  action: {
    documents: defineMessages({
      title: {
        id: 'an.application:inReview.action.documents.title',
        defaultMessage: 'Áminning frá Sjúkratryggingum Íslands',
        description: 'Title for action message in document section',
      },
      description: {
        id: 'an.application:inReview.action.documents.description',
        defaultMessage:
          'Eftirtalin skjöl hafa enn ekki borist en eru nauðsynleg svo hægt er að taka afstöðu til bótaskyldu: ',
        description: 'Description for action message in document section',
      },
      actionButtonTitle: {
        id: 'an.application:inReview.action.documents.actionButtonTitle',
        defaultMessage: 'Bæta við skjölum',
        description:
          'Action button title for action message in document section',
      },
    }),
    representative: defineMessages({
      title: {
        id: 'an.application:inReview.action.representative.title',
        defaultMessage: 'Áminning frá Sjúkratryggingum Íslands',
        description: 'Title for action message in representative section',
      },
      description: {
        id: 'an.application:inReview.action.representative.description',
        defaultMessage:
          'Það er nauðsynlegt að forsvarsmaður fari yfir tilkynningu áður en Sjúkratryggingar Íslands getur tekið afstöðu til bótaskyldu.',
        description: 'Description for action message in representative section',
      },
      actionButtonTitle: {
        id: 'an.application:inReview.action.representative.actionButtonTitle',
        defaultMessage: 'Skoða tilkynningu',
        description:
          'Action button title for action message in representative section',
      },
    }),
  },
  buttons: defineMessages({
    backButton: {
      id: 'an.application:inReview.buttons.backButton',
      defaultMessage: 'Til baka',
      description: 'Review back button',
    },
    forwardButton: {
      id: 'an.application:inReview.buttons.forwardButton',
      defaultMessage: 'Halda áfram',
      description: 'Review forward button',
    },
    sendAttachmentsButton: {
      id: 'an.application:inReview.buttons.sendAttachmentsButton',
      defaultMessage: 'Senda fylgiskjöl',
      description: 'Review send attachments button',
    },
  }),
  confirmationModal: {
    default: defineMessages({
      cancelButton: {
        id: 'an.application:inReview.confirmationModal.default.cancelButton',
        defaultMessage: 'Hætta við',
        description: 'Confirmation modal cancel button',
      },
    }),
    reject: defineMessages({
      title: {
        id: 'an.application:inReview.confirmationModal.reject.title',
        defaultMessage: 'Andmæla tilkynningu',
        description: 'Confirmation modal reject title',
      },
      text: {
        id: 'an.application:inReview.confirmationModal.reject.text',
        defaultMessage:
          'Þú ert að fara að andmæla tilkynningu. Athugaðu að það er ekki hægt að bæta við athugasemdum eftir að tilkynning hefur verið andmælt.',
        description: 'Confirmation modal reject text',
      },
      buttonText: {
        id: 'an.application:inReview.confirmationModal.reject.buttonText',
        defaultMessage: 'Andmæla tilkynningu',
        description: 'Confirmation modal reject button',
      },
    }),
    approve: defineMessages({
      title: {
        id: 'an.application:inReview.confirmationModal.approve.title',
        defaultMessage: 'Staðfesta tilkynningu',
        description: 'Confirmation modal approve title',
      },
      text: {
        id: 'an.application:inReview.confirmationModal.approve.text',
        defaultMessage:
          'Þú ert að fara að staðfesta tilkynningu. Athugaðu að það er ekki hægt að bæta við athugasemdum eftir að tilkynning hefur verið staðfest.',
        description: 'Confirmation modal approve text',
      },
      buttonText: {
        id: 'an.application:inReview.confirmationModal.approve.buttonText',
        defaultMessage: 'Staðfesta tilkynningu',
        description: 'Confirmation modal approve button',
      },
    }),
  },
}
