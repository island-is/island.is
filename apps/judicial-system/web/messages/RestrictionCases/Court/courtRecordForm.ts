import { defineMessages } from 'react-intl'

export const rcCourtRecord = {
  sections: {
    sessionBookings: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.title',
        defaultMessage: 'Bókanir fyrir úrskurð',
        description:
          'Notaður sem titill fyrir "Bókarnir fyrir úrskurð" hlutann í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.label',
        defaultMessage: 'Afstaða varnaraðila, málflutningur og aðrar bókanir',
        description:
          'Notaður sem titill í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.tooltip',
        defaultMessage:
          'Nánari útlistun á afstöðu sakbornings, málflutningsræður og annað sem fram kom í þinghaldi er skráð hér...',
        description:
          'Notaður sem skýritexti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.tooltip-2',
        defaultMessage:
          'Hér er hægt að bóka í þingbók um réttindi og afstöðu kærða, ásamt bókunum t.d. um verjanda og túlk. Auk þess er málflutningur bókaður hér.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Afstaða varnaraðila, málflutningur og aðrar bókanir" svæðið í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillRightToRemainSilent: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_right_to_remain_silent',
        defaultMessage:
          'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillCourtDocumentOne: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_court_document_one',
        defaultMessage: 'Sakborningi er kynnt krafa á dómskjali nr. 1.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillAccusedPlea: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_accused_plea',
        defaultMessage:
          'Sakborningur mótmælir kröfunni / Sakborningur samþykkir kröfuna',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillDefender: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_defender',
        defaultMessage:
          '{defender} lögmaður er skipaður verjandi sakbornings að hans ósk.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillTranslator: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_translator',
        defaultMessage:
          '{translator} túlkar fyrir sakborning það sem fram fer í þinghaldinu.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillPresentations: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_presentations',
        defaultMessage:
          'Sækjandi ítrekar kröfu um gæsluvarðhald, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara.\n\nVerjandi {accused} ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að {accused} verði gert að sæta farbanni í stað gæsluvarðhalds, en til þrautavara að gæsluvarðhaldi verði markaður skemmri tími en krafist er og að {accused} verði ekki gert að sæta einangrun á meðan á gæsluvarðhaldi stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhaldsmálum.',
      },
      autofillPresentationsTravelBan: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_presentations_travel_ban',
        defaultMessage:
          'Sækjanda og verjanda varnaraðila er gefinn kostur á að tjá sig um kröfuna. Verjandi krefst þess að kröfunni verði hafnað en til vara að farbanni verði markaður skemmri tími.\n\nMálið er tekið til úrskurðar.\n\nÍ málinu er kveðinn upp úrskurður.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í farbannsmálum.',
      },
    }),
    courtLocation: defineMessages({
      label: {
        id:
          'judicial.system.restriction_cases:court_record.court_location.label',
        defaultMessage: 'Hvar var dómþing haldið?',
        description:
          'Notaður sem titill í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:court_record.court_location.placeholder',
        defaultMessage:
          'Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"',
        description:
          'Notaður sem skýritexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:court_record.court_location.tooltip',
        defaultMessage:
          'Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.',
        description:
          'Notaður sem upplýsingatexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
