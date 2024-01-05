import { defineMessages } from 'react-intl'

export const conclusion = {
  information: defineMessages({
    sectionTitle: {
      id: 'uiForms.application:conclusion.information.sectionTitle',
      defaultMessage: 'Staðfesting',
      description:
        'The title of the form conclusion section for all applications (in sidebar)',
    },
    formTitle: {
      id: 'uiForms.application:conclusion.information.formTitle',
      defaultMessage: 'Umsókn móttekin!',
      description:
        'The title of the form conclusion section for all applications (in the form it self)',
    },
  }),
  alertMessageField: defineMessages({
    title: {
      id: 'uiForms.application:conclusion.alertMessageField.title',
      defaultMessage: 'Umsókn móttekin!',
      description:
        'The title of the alert message field in the conclusion section',
    },
    message: {
      id: 'uiForms.application:conclusion.alertMessageField.message',
      defaultMessage: 'Takk fyrir umsóknina!',
      description:
        'The message of the alert message field in the conclusion section',
    },
  }),
  expandableDescriptionField: defineMessages({
    title: {
      id: 'uiForms.application:conclusion.expandableDescriptionField.title',
      defaultMessage: 'Hvað gerist næst?',
      description:
        'The title of the expandable description field in the conclusion section',
    },
    introText: {
      id: 'uiForms.application:conclusion.expandableDescriptionField.introText#markdown',
      defaultMessage: 'Umsókn þín hefur verið móttekin og verður skoðuð.',
      description:
        'The intro text of the expandable description field in the conclusion section',
    },
    description: {
      id: 'uiForms.application:conclusion.expandableDescriptionField.description#markdown',
      defaultMessage:
        '* Þú getur nálgast þínar umsóknir á mínum síðum á island.is.\n',
      description:
        'The description of the expandable description field in the conclusion section',
    },
  }),
  pdfLinkButtonField: defineMessages({
    downloadButtonTitle: {
      id: 'uiForms.application:conclusion.pdfLinkButtonField.downloadButtonTitle',
      defaultMessage: 'Hlaða niður skjali',
      description: 'Button label to download file',
    },
    verificationDescription: {
      id: 'uiForms.application:conclusion.pdfLinkButtonField.verificationDescription',
      defaultMessage: 'Nánari upplýsingar um sannreyningu má finna á',
      description: 'The description about verification',
    },
    verificationLinkTitle: {
      id: 'uiForms.application:conclusion.pdfLinkButtonField.verificationLinkTitle',
      defaultMessage: 'island.is/sannreyna',
      description:
        'The title for the link to further information about the verification',
    },
    verificationLinkUrl: {
      id: 'uiForms.application:conclusion.pdfLinkButtonField.verificationLinkUrl',
      defaultMessage: 'https://island.is/sannreyna',
      description:
        'The url for the link to further information about the verification',
    },
  }),
}
