import { defineMessage, defineMessages } from 'react-intl'

export const accused = {
  heading: defineMessage({
    id: 'judicial.system.restriction_cases:accused.heading',
    defaultMessage: 'Sakborningur',
    description:
      'Notaður sem titill á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  receivedAlert: defineMessages({
    title: {
      id: 'judicial.system.restriction_cases:accused.received_alert.title',
      defaultMessage: 'Athugið',
      description:
        'Notaður sem titill í upplýsingarboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    message: {
      id: 'judicial.system.restriction_cases:accused.received_alert.message',
      defaultMessage:
        'Hægt er að breyta efni kröfunnar og bæta við rannsóknargögnum eftir að hún hefur verið send dómstól en til að breytingar skili sér í dómskjalið sem verður til hliðsjónar í þinghaldinu þarf að smella á Endursenda kröfu á skjánum Yfirlit kröfu.',
      description:
        'Notaður sem skilaboð í upplýsingarboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  sections: {
    accusedInfo: {
      heading: defineMessage({
        id: 'judicial.system.restriction_cases:accused.accused_info.heading',
        defaultMessage: 'Sakborningur',
        description:
          'Notaður sem titill fyrir "upplýsingar um sakborning" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
    },
    defenderInfo: {
      heading: defineMessage({
        id: 'judicial.system.restriction_cases:accused.defender_info.heading',
        defaultMessage: 'Verjandi sakbornings',
        description:
          'Notaður sem titill fyrir "upplýsingar um verjanda sakborning" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
      name: defineMessages({
        label: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.name.label',
          defaultMessage: 'Nafn verjanda',
          description:
            'Notaður sem titill í "nafn verjanda" textaboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        placeholder: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.name.placeholder',
          defaultMessage: 'Fullt nafn',
          description:
            'Notaður sem skýritexti í "nafn verjanda" textaboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
      email: defineMessages({
        label: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.email.label',
          defaultMessage: 'Netfang verjanda',
          description:
            'Notaður sem titill í "netfang verjanda" textaboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        placeholder: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.email.placeholder',
          defaultMessage: 'Netfang',
          description:
            'Notaður sem skýritexti í "nafn verjanda" textaboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
      phoneNumber: defineMessages({
        label: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.phoneNumber.label',
          defaultMessage: 'Símanúmer verjanda',
          description:
            'Notaður sem titill í "símanúmer verjanda" textaboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        placeholder: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.phone_number.placeholder',
          defaultMessage: 'Símanúmer',
          description:
            'Notaður sem skýritexti í "símanúmer verjanda" textaboxi á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
      sendRequest: defineMessages({
        label: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.send_request.label',
          defaultMessage:
            'Senda kröfu sjálfvirkt í tölvupósti til verjanda við úthlutun fyrirtökutíma',
          description:
            'Notaður sem texti í "senda kröfu sjálfvirkt..." gátreit á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        tooltip: {
          id:
            'judicial.system.restriction_cases:accused.defender_info.send_request.tooltip',
          defaultMessage:
            'Ef hakað er hér þá fær verjandi {caseType} senda þegar fyrirtökutíma hefur verið úthlutað',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "senda kröfu sjálfvirkt..." gátreit á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
    },
    leadInvestigator: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:accused.lead_investigator.heading',
        defaultMessage: 'Stjórnandi rannsóknar',
        description:
          'Notaður sem titill fyrir "stjórnanda rannsóknar" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:accused.lead_investigator.tooltip',
        defaultMessage:
          'Upplýsingar um stjórnanda rannsóknar birtast á vistunarseðli sem berst til gæslufangelsis.',
        description:
          'Notaður sem aðstoðartexti fyrir "stjórnanda rannsóknar" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:accused.lead_investigator.label',
        defaultMessage: 'Sláðu inn stjórnanda rannsóknar',
        description:
          'Notaður sem titill í textaboxi fyrir "stjórnanda rannsóknar" á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:accused.lead_investigator.placeholder',
        defaultMessage: 'Hver stýrir rannsókn málsins?',
        description:
          'Notaður sem skýritexti í textaboxi fyrir "stjórnanda rannsóknar" á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
