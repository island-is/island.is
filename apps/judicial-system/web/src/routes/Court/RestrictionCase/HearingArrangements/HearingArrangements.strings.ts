import { defineMessage, defineMessages } from 'react-intl'

// Strings for court officials
export const rcHearingArrangements = {
  title: defineMessage({
    id: 'judicial.system.core:restriction_cases_hearing_arrangements.title',
    defaultMessage: 'Fyrirtaka',
    description:
      'Notaður sem titill á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    requestedCourtDate: defineMessages({
      title: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.requested_court_date.title',
        defaultMessage: 'Staður og stund fyrirtöku',
        description:
          'Notaður sem titill fyrir "Skrá fyrirtökutíma" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  continueButton: defineMessages({
    label: {
      id: 'judicial.system.core:restriction_cases_hearing_arrangements.continue_button.label',
      defaultMessage: 'Staðfesta',
      description:
        'Notaður sem titill á halda áfram takka í fyrirtöku skrefi gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  modal: {
    custodyCases: defineMessages({
      heading: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.modal.custody_cases.heading',
        defaultMessage: 'Viltu senda tilkynningu um fyrirtökutíma?',
        description:
          'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í gæsluvarðhaldsmálum.',
      },
      text: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.modal.custody_cases.text',
        defaultMessage:
          '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning verður send á sækjanda, fangelsi og verjanda hafi verjandi verið skráður.',
        description:
          'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í gæsluvarðhaldsmálum.',
      },
    }),
    travelBanCases: defineMessages({
      heading: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.modal.travel_ban_cases.heading',
        defaultMessage: 'Viltu senda tilkynningu um fyrirtökutíma?',
        description:
          'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í farbannsmálum.',
      },
      text: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.modal.travel_ban_cases.text',
        defaultMessage:
          '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning verður send á sækjanda, fangelsi og verjanda hafi verjandi verið skráður.',
        description:
          'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
    }),
    shared: defineMessages({
      secondaryButtonText: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.modal.shared.secondary_button_text',
        defaultMessage:
          'Nei{courtDateHasChanged, select, true {} other {, senda seinna}}',
        description:
          'Notaður sem texti í "Nei" takkann í tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
      primaryButtonText: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.modal.shared.primary_button_text',
        defaultMessage: 'Já, senda',
        description:
          'Notaður sem texti í "Já, senda" takkann í tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
    }),
  },
}
