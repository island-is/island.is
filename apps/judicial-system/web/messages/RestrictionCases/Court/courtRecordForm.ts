import { defineMessages } from 'react-intl'

export const rcCourtRecord = {
  sections: {
    courtDocuments: {
      title: {
        id:
          'judicial.system.restriction_cases:court_record.court_documents.title',
        defaultMessage: 'Dómskjöl',
        description: 'Notaður sem titill fyrir "Dómskjöl" hlutan',
      },
      firstDocument: {
        title: {
          id:
            'judicial.system.restriction_cases:court_record.court_documents.firstDocument.title',
          defaultMessage: 'Krafa um {caseType}',
          description:
            'Notaður sem titill fyrir fyrsta dómskjal í dómskjala hlutaunum',
        },
        label: {
          id:
            'judicial.system.restriction_cases.court_record.court_documents.firstDocument.label',
          defaultMessage: 'Rannsóknargögn málsins liggja frammi.',
          description: 'Notaður sem text fyrir afan fyrsta þingskjal',
        },
      },
    },
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
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_presentations#markdown',
        defaultMessage:
          'Sækjandi ítrekar kröfu um gæsluvarðhald, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara.\n\nVerjandi {accused} ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að {accused} verði gert að sæta farbanni í stað gæsluvarðhalds, en til þrautavara að gæsluvarðhaldi verði markaður skemmri tími en krafist er og að {accused} verði ekki gert að sæta einangrun á meðan á gæsluvarðhaldi stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhaldsmálum.',
      },
      autofillPresentationsV2: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_presentations_v2#markdown',
        defaultMessage:
          'Sækjandi ítrekar kröfu um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}}, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara.\n\nVerjandi {accused} ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að {accused} verði gert að sæta farbanni í stað {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}}, en til þrautavara að {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldi}} verði markaður skemmri tími en krafist er og að {accused} verði ekki gert að sæta einangrun á meðan á {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldi}} stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.',
        description:
          'Sjálfgefinn texti í "Afstaða varnaraðila, málflutningur og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhaldsmálum.',
      },
      autofillPresentationsTravelBan: {
        id:
          'judicial.system.restriction_cases:court_record.session_bookings.autofill_presentations_travel_ban#markdown',
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
    conclusion: {
      id: 'judicial.system.restriction_cases:court_record.conclusion.title',
      defaultMessage: 'Úrskurðarorð',
      description:
        'Notaður sem titill fyrir "Úrskurðarorð" hlutann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    appealDecision: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.title',
        defaultMessage: 'Ákvörðun um kæru',
        description:
          'Notaður sem titill fyrir "Ákvörðun um kæru" hlutann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      disclaimer: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.disclaimer',
        defaultMessage:
          'Dómari kynnir rétt til að kæra úrskurð og um kærufrest skv. 193. gr. laga nr. 88/2008.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedTitle: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.accused_title',
        defaultMessage: 'Afstaða {accused} til málsins í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Afstaða kærða til málsins í lok þinghalds" spjald á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAppeal: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.accused_appeal',
        defaultMessage: '{accused} kærir úrskurðinn',
        description:
          'Notaður sem texti við valmöguleika kærða um að kæra úrskurðinn radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAccept: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.accused_accept',
        defaultMessage: '{accused} unir úrskurðinum',
        description:
          'Notaður sem texti við valmöguleika kærða um að una úrskurðinum radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedPostpone: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.accused_postpone',
        defaultMessage: '{accused} tekur sér lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleika kærða um lögbundinn frest radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedNotApplicable: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.accused_not_applicable',
        defaultMessage: 'Á ekki við',
        description:
          'Notaður sem texti við valmöguleika kærða um á ekki við radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAnnouncementLabel: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.accused_announcement_label',
        defaultMessage: 'Yfirlýsing {accused}',
        description:
          'Notaður sem titill á "Yfirlýsing kærða" innsláttarsvæði á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAnnouncementPlaceholder: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.accused_announcement_placeholder',
        defaultMessage:
          'Hér er hægt að bóka frekar um það sem {accused} vill taka fram ef við á.',
        description:
          'Notaður sem placeholder í "Yfirlýsing kærða" innsláttarsvæði á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorTitle: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.prosecutor_title',
        defaultMessage: 'Afstaða sækjanda til málsins í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Afstaða sækjanda til málsins í lok þinghalds" spjald á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAppeal: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.prosecutor_appeal',
        defaultMessage: 'Sækjandi kærir úrskurðinn',
        description:
          'Notaður sem texti við valmöguleika sækjanda um að kæra úrskurðinn radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAccept: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.prosecutor_accept',
        defaultMessage: 'Sækjandi unir úrskurðinum',
        description:
          'Notaður sem texti við valmöguleika sækjanda um að una úrskurðinum radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorPostpone: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.prosecutor_postpone',
        defaultMessage: 'Sækjandi tekur sér lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleika sækjanda um lögbundinn frest radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorNotApplicable: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.prosecutor_not_applicable',
        defaultMessage: 'Á ekki við',
        description:
          'Notaður sem texti við valmöguleika sækjanda um á ekki við radio takkann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAnnouncementLabel: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.prosecutor_announcement_label',
        defaultMessage: 'Yfirlýsing sækjanda',
        description:
          'Notaður sem titill á "Yfirlýsing sækjanda" innsláttarsvæði á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAnnouncementPlaceholder: {
        id:
          'judicial.system.restriction_cases:court_record.appeal_decision.prosecutor_announcement_placeholder',
        defaultMessage:
          'Hér er hægt að bóka frekar um það sem sækjandi vill taka fram ef við á.',
        description:
          'Notaður sem placeholder í "Yfirlýsing sækjanda" innsláttarsvæði á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    custodyRestrictions: defineMessages({
      disclaimer: {
        id:
          'judicial.system.restriction_cases:court_record.custody_restrictions.disclaimer',
        defaultMessage:
          'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd {caseType} undir dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      disclaimerV2: {
        id:
          'judicial.system.restriction_cases:court_record.custody_restrictions.disclaimer_v2',
        defaultMessage:
          'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd {caseType, select, ADMISSION_TO_FACILITY {vistunarinnar á viðeigandi stofnun} TRAVEL_BAN {farbannsins} other {gæsluvarðhaldsins}} undir dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    endOfSessionBookings: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:court_record.end_of_session_bookings.title',
        defaultMessage: 'Bókanir í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Bókanir í lok þinghalds" hlutann á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:court_record.end_of_session_bookings.label',
        defaultMessage: 'Tilhögun gæslu og aðrar bókanir',
        description:
          'Notaður sem titill á "Tilhögun gæslu og aðrar bókanir" innsláttarsvæði á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:court_record.end_of_session.placeholder',
        defaultMessage: 'Hér er hægt að skrá aðrar bókanir',
        description:
          'Notaður sem placeholder fyrir "Tilhögun gæslu og aðrar bókanir" innsláttarsvæði á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  nextButtonInfo: {
    id: 'judicial.system.restriction_cases:court_record.next_button_info',
    defaultMessage:
      'Til að halda áfram þarf að skrá lyktir máls og skrifa úrskurðarorð á skjánum Úrskurður.',
    description:
      'Notaður sem texti í info panel sem kemur í staðinn fyrir Áfram takk þegar ekki er búið að setja lyktir máls eða úrskurðarorð',
  },
}
