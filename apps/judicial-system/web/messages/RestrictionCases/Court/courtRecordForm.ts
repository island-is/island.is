export const rcCourtRecord = {
  sections: {
    title: 'Þingbók',
    courtStartDate: {
      dateLabel: 'Dagsetning þingfestingar',
      timeLabel: 'Þinghald hófst',
    },
    sessionBookings: {
      title: 'Bókanir fyrir úrskurð',
      label: 'Afstaða varnaraðila, málflutningur og aðrar bókanir',
      placeholder:
        'Nánari útlistun á afstöðu varnaraðila, málflutningsræður og annað sem fram kom í þinghaldi er skráð hér...',
      tooltip:
        'Hér er hægt að bóka í þingbók um réttindi og afstöðu kærða, ásamt bókunum t.d. um verjanda og túlk. Auk þess er málflutningur bókaður hér.',
      autofillRightToRemainSilent:
        'Varnaraðila er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Varnaraðili er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
      autofillCourtDocumentOne: 'Varnaraðila er kynnt krafa á dómskjali nr. 1.',
      autofillAccusedPlea:
        'Varnaraðili mótmælir kröfunni / Varnaraðili samþykkir kröfuna',
      autofillTranslator:
        '{translator} túlkar fyrir sakborning það sem fram fer í þinghaldinu.',
      autofillPresentationsV3:
        'Sækjandi ítrekar kröfu um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}}, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara. Verjandi varnaraðila ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að varnaraðila verði gert að sæta farbanni í stað {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}}, en til þrautavara að {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldi}} verði markaður skemmri tími en krafist er og að varnaraðila verði ekki gert að sæta einangrun á meðan á {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldi}} stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.',
      autofillPresentationsTravelBan:
        'Sækjanda og verjanda varnaraðila er gefinn kostur á að tjá sig um kröfuna. Verjandi krefst þess að kröfunni verði hafnað en til vara að farbanni verði markaður skemmri tími.\n\nMálið er tekið til úrskurðar.\n\nÍ málinu er kveðinn upp úrskurður.',
    },
    courtLocation: {
      label: 'Hvar var dómþing haldið?',
      placeholder: 'Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"',
      tooltip:
        'Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.',
    },
    conclusion: 'Úrskurðarorð',
    custodyRestrictions: {
      disclaimerV2:
        'Dómari bendir varnaraðila á að unnt er að bera atriði er varða framkvæmd gæsluvarðhalds undir dómara.',
    },
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
      text: 'Til að halda áfram þurfa lyktir máls, niðurstaða og úrskurðarorð að vera skráð á skjánum Úrskurður.',
    },
  },
}
