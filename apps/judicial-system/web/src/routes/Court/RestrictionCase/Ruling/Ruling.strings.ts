export const strings = {
  title: 'Úrskurður',
  sections: {
    conclusion: {
      dismissingAutofill:
        'Kröfu um að varnaraðili, {defendantName}, sæti{isExtended, select, true { áframhaldandi} other {}} {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbanni} other {gæsluvarðhaldi}} er vísað frá.',
      rejectingAutofill:
        'Kröfu um að varnaraðili, {defendantName}{defendantDOB}sæti{isExtended, select, true { áframhaldandi} other {}} {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbanni} other {gæsluvarðhaldi}} er hafnað.',
      acceptingAutofill:
        'Varnaraðili, {defendantName}{defendantDOB}skal sæta {isExtended, select, true {áframhaldandi } other {}}{caseType, select, TRAVEL_BAN {farbanni} ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhaldi}}, þó ekki lengur en til {validToDate}.{hasIsolation, select, true { Varnaraðili skal sæta einangrun {isolationEndsBeforeValidToDate, select, true {ekki lengur en til {isolationToDate}} other {á meðan á {caseType, select, ADMISSION_TO_FACILITY {vistunni} other {gæsluvarðhaldinu}} stendur}}.} other {}}',
      title: 'Úrskurðarorð',
      label: 'Úrskurðarorð',
      placeholder:
        'Tillaga að úrskurðarorði forbókast hér þegar lyktir máls eru valdar',
    },
    courtCaseFacts: {
      title: 'Málsatvik',
      tooltip:
        'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
      label: 'Greinargerð um málsatvik',
      placeholder:
        'Hvað hefur átt sér stað hingað til? Hver er framburður varnaraðila og vitna? Hver er staða rannsóknar og næstu skref?',
    },
    courtLegalArguments: {
      title: 'Lagarök',
      tooltip:
        'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
      label: 'Greinargerð um lagarök',
      placeholder:
        'Hvað hefur átt sér stað hingað til? Hver er framburður varnaraðila og vitna? Hver er staða rannsóknar og næstu skref?',
    },
    decision: {
      title: 'Lyktir máls',
    },
    introduction: {
      autofill: 'Mál þetta var þingfest og tekið til úrskurðar {date}.',
      title: 'Aðfararorð',
      label: 'Aðfararorð',
      placeholder:
        'Hér er m.a. unnt að greina frá því hvaða dag krafa var tekin fyrir og/eða tekin til úrskurðar.',
    },
    prosecutorDemands: {
      title: 'Dómkröfur',
      label: 'Dómkröfur',
      placeholder: 'Hvað hafði ákæruvaldið að segja?',
    },
    ruling: {
      title: 'Niðurstaða',
    },
  },
}
