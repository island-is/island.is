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
    messageText: {
      id: 'uiForms.application:messages.information.text',
      defaultMessage:
        'Upplýsingar í mínum síðum og í appi hefur þú aðgang að margvíslegum upplýsingum s.s stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, fasteignir, ökutæki, skírteini, starfsleyfi ofl.',
      description:
        'Text for form builder component left side of button to go to the service portal',
    },
    buttonTitle: {
      id: 'uiForms.application:messages.information.buttonText',
      defaultMessage: 'Áfram',
      description:
        'Button text for form builder component, go to service portal',
    },
  }),
}
