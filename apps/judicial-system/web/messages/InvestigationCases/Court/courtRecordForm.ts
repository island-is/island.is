import { defineMessages } from 'react-intl'

export const icCourtRecord = {
  sections: {
    accusedBookings: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.title',
        defaultMessage: 'Bókanir um varnaraðila',
        description:
          'Notaður sem titill fyrir "Bókarnir um varnaraðila" hlutann í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.label',
        defaultMessage: 'Afstaða varnaraðila og aðrar bókanir',
        description:
          'Notaður sem titill í "Afstaða varnaraðila og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.placeholder',
        defaultMessage: 'Nánari útlistun á afstöðu sakbornings',
        description:
          'Notaður sem skýritexti í "Afstaða varnaraðila og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.tooltip-2',
        defaultMessage:
          'Hér er hægt að bóka í þingbók um réttindi og afstöðu varnaraðila, ásamt bókunum t.d. um verjanda og túlk. Hægt er að sleppa öllum bókunum hér, t.d. ef varnaraðili er ekki viðstaddur.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Afstaða varnaraðila og aðrar bókanir" svæðið í rannsóknarheimildum.',
      },
      autofill: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.autofill#markdown',
        defaultMessage:
          'Varnaraðila er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Varnaraðili er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.\\n\\nVarnaraðila er kynnt krafa á dómskjali nr. 1.\\n\\nVarnaraðili mótmælir kröfunni / Varnaraðili samþykkir kröfuna',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
    litigationPresentations: defineMessages({
      autofill: {
        id:
          'judicial.system.investigation_cases:court_record.litigation_presentations.autofill',
        defaultMessage:
          'Málflutningur var skriflegur og gögn send dómara rafrænt.',
        description:
          'Notaður sem sjálfgefinn texti í "Málflutningur" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
    courtLocation: defineMessages({
      label: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.label',
        defaultMessage: 'Hvar var dómþing haldið?',
        description:
          'Notaður sem titill í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.placeholder',
        defaultMessage:
          'Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"',
        description:
          'Notaður sem skýritexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.tooltip',
        defaultMessage:
          'Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.',
        description:
          'Notaður sem upplýsingatexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
