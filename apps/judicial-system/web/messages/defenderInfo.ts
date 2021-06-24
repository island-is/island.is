import { defineMessages } from 'react-intl'

// Strings for defender info components
export const defenderInfo = {
  name: defineMessages({
    label: {
      id: 'judicial.system:component.defender.name.label',
      defaultMessage: 'Nafn verjanda',
      description: 'Defender component name field: Label',
    },
    placeholder: {
      id: 'judicial.system:component.defender.name.placeholder',
      defaultMessage: 'Fullt nafn',
      description: 'Defender component name field: Placeholder',
    },
  }),
  email: defineMessages({
    label: {
      id: 'judicial.system:component.defender.email.label',
      defaultMessage: 'Netfang verjanda',
      description: 'Defender component email field: Label',
    },
    placeholder: {
      id: 'judicial.system:component.defender.email.placeholder',
      defaultMessage: 'Netfang',
      description: 'Defender component email field: Placeholder',
    },
  }),
  phoneNumber: defineMessages({
    label: {
      id: 'judicial.system:component.defender.phoneNumber.label',
      defaultMessage: 'Símanúmer verjanda',
      description: 'Defender component phoneNumber field: Label',
    },
    placeholder: {
      id: 'judicial.system:component.defender.phoneNumber.placeholder',
      defaultMessage: 'Símanúmer',
      description: 'Defender component phoneNumber field: Placeholder',
    },
  }),
  sendRequest: defineMessages({
    label: {
      id: 'judicial.system:component.defender.sendRequest.label',
      defaultMessage:
        'Senda kröfu sjálfvirkt í tölvupósti til verjanda við úthlutun fyrirtökutíma',
      description: 'Defender component sendRequest field: Label',
    },
    tooltip: {
      id: 'judicial.system:component.defender.sendRequest.tooltip',
      defaultMessage:
        'Ef hakað er hér þá fær verjandi {caseType} senda þegar fyrirtökutíma hefur verið úthlutað',
      description: 'Defender component sendRequest field: Tooltip',
    },
  }),
}
