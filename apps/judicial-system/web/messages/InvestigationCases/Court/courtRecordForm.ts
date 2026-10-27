export const icCourtRecord = {
  sections: {
    title: 'Þingbók',
    courtStartDate: {
      dateLabel: 'Dagsetning þingfestingar',
      timeLabel: 'Þinghald hófst',
    },
    sessionBookings: {
      title: 'Bókanir fyrir úrskurð',
      label: 'Afstaða varnaraðila, málflutningur og aðrar bókanir',
      placeholder: 'Nánari útlistun á afstöðu sakbornings, málflutningsræður og annað sem fram kom í þinghaldi er skráð hér...',
      tooltip: 'Hér er hægt að bóka í þingbók um réttindi og afstöðu varnaraðila, ásamt bókunum t.d. um verjanda og túlk. Auk þess er málflutningur bókaður hér',
      autofillRightToRemainSilent: 'Varnaraðila er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
      autofillCourtDocumentOne: 'Varnaraðila er kynnt krafa á dómskjali nr. 1.',
      autofillAccusedPlea: 'Varnaraðili mótmælir kröfunni / Varnaraðili samþykkir kröfuna',
      autofillAllPresent: `Sækjanda og verjanda varnaraðila er gefinn kostur á að tjá sig um kröfuna. Verjandi krefst þess að kröfunni verði hafnað.

Málið er tekið til úrskurðar.

Í málinu er kveðinn upp úrskurður.`,
      autofillTranslator: '{translator} túlkar fyrir varnaraðila það sem fram fer í þinghaldinu.',
      autofillSpokeperson: `Dómari hefur fallist á að krafan hljóti meðferð fyrir dómi án þess að varnaraðili verði kvaddur/kvödd á dómþing, sbr. 1. mgr. 104. gr. laga nr. 88/2008.

Sækjanda og talsmanni varnaraðila er gefinn kostur á að tjá sig um kröfuna. Talsmaður varnaraðila mótmælir kröfunni og krefst þess að kröfunni verði hafnað en til vara að aðgerðinni verði markaður skemmri tími. Þá krefst talsmaður þóknunar fyrir sín störf.

Málið er tekið til úrskurðar.

Í málinu er kveðinn upp úrskurður.`,
      autofillProsecutor: `Dómari hefur fallist á að krafan hljóti meðferð fyrir dómi án þess að varnaraðili verði kvaddur/kvödd á dómþing, sbr. 1. mgr. 104. gr. laga nr. 88/2008.

Sækjanda er gefinn kostur á að tjá sig um kröfuna.`,
      autofillNonePresent: 'Dómari hefur fallist á að krafan hljóti meðferð fyrir dómi án þess að varnaraðili verði kvaddur/kvödd á dómþing, sbr. 1. mgr. 104. gr. laga nr. 88/2008.',
      autofillRestrainingOrder: `Sækjanda, réttargæslumanni og verjanda varnaraðila er gefinn kostur á að tjá sig um kröfuna. Verjandi krefst þess að kröfunni verði hafnað en til vara að nálgunarbanni verði markaður skemmri tími. Þá krefjast verjandi og réttargæslumaður þóknunar sér til handa.

Málið er tekið til úrskurðar.

Í málinu er kveðinn upp úrskurður.`,
      autofillExpulsionFromHome: `Sækjanda, réttargæslumanni og verjanda varnaraðila er gefinn kostur á að tjá sig um kröfuna. Verjandi krefst þess að kröfunni verði hafnað. Þá krefjast verjandi og réttargæslumaður þóknunar sér til handa.

Málið er tekið til úrskurðar.

Í málinu er kveðinn upp úrskurður.`,
      autofillAutopsy: `Ekki er sótt þing af hálfu varnaraðila.

Sækjanda er gefinn kostur á að tjá sig um kröfuna.

Málið er tekið til úrskurðar.

Í málinu er kveðinn upp úrskurður.`,
    },
    courtLocation: {
      label: 'Hvar var dómþing haldið?',
      placeholder: 'Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"',
      tooltip: 'Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.',
    },
    conclusion: 'Úrskurðarorð',
    endOfSessionBookings: {
      title: 'Bókanir í lok þinghalds',
      label: 'Tilhögun gæslu og aðrar bókanir',
      placeholder: 'Hér er hægt að skrá aðrar bókanir',
    },
    endOfSessionTitle: 'Lok þinghalds eftir uppkvaðningu úrskurðar',
    courtEndTime: {
      dateLabel: 'Dagsetning uppkvaðningar',
      timeLabel: 'Þinghaldi lauk',
    },
    nextButtonInfo: {
      text: 'Til að halda áfram þarf að skrá lyktir máls {isCompletedWithoutRuling, select, true {} other {og skrifa úrskurðarorð}} á skjánum Úrskurður.',
    },
  },
}
