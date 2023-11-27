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
}
