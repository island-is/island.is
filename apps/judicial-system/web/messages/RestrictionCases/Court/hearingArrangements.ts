import { defineMessages, defineMessage } from 'react-intl'

// Strings for court officials
export const rcHearingArrangements = {
  comments: {
    title: defineMessage({
      id:
        'judicial.system.restriction_cases:hearing_arrangements.comments.title',
      defaultMessage: 'Athugasemdir vegna málsmeðferðar',
      description:
        'Notaður sem titill í viðvörunarboxi með athugasemdum vegna málsmeðferðar á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
    }),
  },
  title: defineMessage({
    id: 'judicial.system.restriction_cases:hearing_arrangements.title',
    defaultMessage: 'Fyrirtaka',
    description:
      'Notaður sem titill á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    requestedCourtDate: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.requested_court_date.title',
        defaultMessage: 'Skrá fyrirtökutíma',
        description:
          'Notaður sem titill fyrir "Skrá fyrirtökutíma" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    defender: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.title',
        defaultMessage: 'Verjandi',
        description:
          'Notaður sem titill fyrir "Verjanda" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.tooltip',
        defaultMessage:
          'Lögmaður sem er valinn hér verður skipaður verjandi í þinghaldi og fær sendan úrskurð rafrænt.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Verjanda" fyrirsögn á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      nameLabel: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.name_label',
        defaultMessage: 'Nafn verjanda',
        description:
          'Notaður sem titill í "Nafn verjanda" textaboxi á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      namePlaceholder: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.name_placeholder',
        defaultMessage: 'Fullt nafn',
        description:
          'Notaður sem skýritexti í "Nafn verjanda" textaboxi á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      emailLabel: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.email_label',
        defaultMessage: 'Netfang verjanda',
        description:
          'Notaður sem titill í "Netfang verjanda" textaboxi á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      emailPlaceholder: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.email_placeholder',
        defaultMessage: 'Netfang',
        description:
          'Notaður sem skýritexti í "Netfang verjanda" textaboxi á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      phoneNumberLabel: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.phone_number_label',
        defaultMessage: 'Símanúmer verjanda',
        description:
          'Notaður sem titill í "Símanúmer verjanda" textaboxi á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      phoneNumberPlaceholder: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.phone_number_placeholder',
        defaultMessage: 'Símanúmer',
        description:
          'Notaður sem skýritexti í "Símanúmer verjanda" textaboxi á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  continueButton: defineMessages({
    title: {
      id:
        'judicial.system.restriction_cases:hearing_arrangements.continue_button.title',
      defaultMessage: 'Staðfesta fyrirtökutíma',
      description:
        'Notaður sem titill á halda áfram takka í fyrirtöku skrefi gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  modal: {
    custodyCases: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.custody_cases.heading',
        defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
        description:
          'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í gæsluvarðhaldsmálum.',
      },
      text: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.custody_cases.text',
        defaultMessage:
          'Tilkynning hafi verið send á ákæranda, fangelsi og verjanda hafi verjandi verið skráður.',
        description:
          'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í gæsluvarðhaldsmálum.',
      },
    }),
    travelBanCases: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.travel_ban_cases.heading',
        defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
        description:
          'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í farbannsmálum.',
      },
      text: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.travel_ban_cases.text',
        defaultMessage:
          'Tilkynning hefur verið send á ákæranda og verjanda hafi verjandi verið skráður.',
        description:
          'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
    }),
    shared: defineMessages({
      secondaryButtonText: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.shared.secondary_button_text',
        defaultMessage: 'Nei, senda seinna',
        description:
          'Notaður sem texti í "Nei, senda seinna" takkann í tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
      primaryButtonText: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.shared.primary_button_text',
        defaultMessage: 'Já, senda núna',
        description:
          'Notaður sem texti í "Já, senda núna" takkann í tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
    }),
  },
}
