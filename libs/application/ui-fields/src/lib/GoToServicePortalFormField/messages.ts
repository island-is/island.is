import { defineMessages } from 'react-intl'

export const messages = {
  information: defineMessages({
    text: {
      id: 'uiFields.application:messages.information.text',
      defaultMessage:
        'Upplýsingar í mínum síðum og í appi hefur þú aðgang að margvíslegum upplýsingum s.s stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, fasteignir, ökutæki, skírteini, starfsleyfi ofl.',
      description:
        'Text for form builder component left side of button to go to the service portal',
    },
    buttonText: {
      id: 'uiFields.application:messages.information.buttonText',
      defaultMessage: 'Áfram',
      description:
        'Button text for form builder component, go to service portal',
    },
  }),
}
