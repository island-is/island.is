import { defineMessage, defineMessages } from 'react-intl'

// Strings for Prosecutor restriction request defendantForm
export const restrictionDefendantForm = {
  general: {
    heading: defineMessage({
      id: 'judicial.system:forms.restriction.defendant.general.heading',
      defaultMessage: 'Sakborningur',
      description: 'Prosecutor defendant form: Heading',
    }),
  },
  receivedAlert: defineMessages({
    title: {
      id: 'judicial.system:forms.restrinction.defendant.receivedAlert.title',
      defaultMessage: 'Athugið',
      description: 'Prosecutor defendant form received alert: title',
    },
    message: {
      id: 'judicial.system:forms.restriction.defendant.receivedAlert.message',
      defaultMessage:
        'Hægt er að breyta efni kröfunnar og bæta við rannsóknargögnum eftir að hún hefur verið send dómstól en til að breytingar skili sér í dómskjalið sem verður til hliðsjónar í þinghaldinu þarf að smella á Endursenda kröfu á skjánum Yfirlit kröfu.',
      description: 'Prosecutor defendant form received alert: Message',
    },
  }),
  defendantInfo: {
    heading: defineMessage({
      id: 'judicial.system:forms.restriction.defendant.defendantInfo.heading',
      defaultMessage: 'Sakborningur',
      description: 'Prosecutor defendant form defendant info: Heading',
    }),
  },
  defenderInfo: {
    heading: defineMessage({
      id: 'judicial.system:forms.restriction.defendant.defenderInfo.heading',
      defaultMessage: 'Verjandi sakbornings',
      description: 'Prosecutor defendant form defender info: Heading',
    }),
  },
  leadInvestigator: defineMessages({
    heading: {
      id:
        'judicial.system:forms.restriction.defendant.leadInvestigator.heading',
      defaultMessage: 'Stjórnandi rannsóknar',
      description: 'Prosecutor defendant form lead investigator info: Heading',
    },
    tooltip: {
      id:
        'judicial.system:forms.restriction.defendant.leadInvestigator.tooltip',
      defaultMessage:
        'Upplýsingar um stjórnanda rannsóknar birtast á vistunarseðli sem berst til gæslufangelsis.',
      description: 'Prosecutor defendant form lead investigator info: Tooltip',
    },
    label: {
      id: 'judicial.system:forms.restriction.defendant.leadInvestigator.label',
      defaultMessage: 'Sláðu inn stjórnanda rannsóknar',
      description: 'Prosecutor defendant form lead investigator info: Label',
    },
    placeholder: {
      id:
        'judicial.system:forms.restriction.defendant.leadInvestigator.placeholder',
      defaultMessage: 'Hver stýrir rannsókn málsins?',
      description:
        'Prosecutor defendant form lead investigator info: Placeholder',
    },
  }),
}
