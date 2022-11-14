import { defineMessage, defineMessages } from '@formatjs/intl'

export const notifications = {
  defender: defineMessage({
    id: 'judicial.system.backend:notifications.defender',
    defaultMessage:
      '{sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {Talsmaður} other {Verjandi}} sakbornings{defenderName, select, NONE { hefur ekki verið skráður} other {: {defenderName}}}',
    description:
      'Texti í pósti sem tilgreinir hver talsmaður/verjandi er í máli.',
  }),
  accused: defineMessage({
    id: 'judicial.system.backend:notifications.accused',
    defaultMessage:
      'Nafn sakbornings: {accusedName, select, NONE {Ekki skráð} other {{accusedName}}}.',
    description: 'Texti í pósti sem tilgreinir hver sakborningur er í máli',
  }),
  courtRoom: defineMessage({
    id: 'judicial.system.backend:notifications.court_room',
    defaultMessage:
      '{courtRoom, select, NONE {Dómsalur hefur ekki verið skráður} other {Dómsalur: {courtRoom}}}.',
    description: 'Texti í pósti sem tilgreinir hvaða dómsalur er skráður',
  }),
  judge: defineMessage({
    id: 'judicial.system.backend:notifications.judge',
    defaultMessage:
      '{judgeName, select, NONE {Dómari hefur ekki verið skráður} other {Dómari: {judgeName}}}.',
    description:
      'Texti í pósti sem tilgreinir hvaða dómari er skráður í málinu',
  }),
  registrar: defineMessage({
    id: 'judicial.system.backend:notifications.registrar',
    defaultMessage: 'Dómritari: {registrarName}.',
    description:
      'Texti í pósti sem tilgreinir hvaða dómritari er skráður í málinu',
  }),
  prosecutorText: defineMessage({
    id: 'judicial.system.backend:notifications.prosecutor_text_v2',
    defaultMessage:
      'Sækjandi: {prosecutorName, select, NONE {Ekki skráður} other {{prosecutorName}}}{institutionName, select, NONE {} other { ({institutionName})}}.',
    description:
      'Notaður sem texti í sms-i til þess að tilgreina hver er sækjandi í málinu',
  }),
  readyForCourt: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.ready_for_court.subjectV2',
      defaultMessage:
        '{isIndictmentCase, select, true {Ákæra} other {Krafa um {caseType}}} send',
      description: 'Titill í pósti til ákæranda þegar krafa er send',
    },
    prosecutorHtml: {
      id:
        'judicial.system.backend:notifications.ready_for_court.prosecutor_html_v3',
      defaultMessage:
        'Þú hefur sent {isIndictmentCase, select, true {ákæru} other {kröfu}} á {courtName} vegna LÖKE {policeCaseNumbersCount, plural, zero {máls} one {máls {policeCaseNumbers}} other {mála: {policeCaseNumbers}}}. Skjalið er aðgengilegt undir {linkStart}málinu í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til ákæranda varðandi kröfu sem hefur verið send á héraðsdómara',
    },
  }),
  courtRevoked: defineMessages({
    caseTypeRevoked: {
      id:
        'judicial.system.backend:notifications.court_revoked.case_type_revoked',
      defaultMessage:
        '{caseType, select, TRAVEL_BAN {Farbannskrafa} ADMISSION_TO_FACILITY {Krafa um vistun á viðeigandi stofnun} other {Gæsluvarðhaldskrafa}} afturkölluð.',
      description:
        'Notaður sem texti í sms-i til dómstóla þegar krafa er afturkölluð',
    },
    courtDate: {
      id: 'judicial.system.backend:notifications.court_revoked.court_date',
      defaultMessage: 'Fyrirtökutími: {date}, kl. {time}.',
      description:
        'Notaður sem texti í afturköllunar sms-i til dómstóla til þess að tilgreina hvenær fyrirtaka átti að vera',
    },
    requestedCourtDate: {
      id:
        'judicial.system.backend:notifications.court_revoked.requested_court_date',
      defaultMessage: 'ÓVE fyrirtöku {date}, eftir kl. {time}.',
      description:
        'Notaður sem texti í afturköllunar sms-i til þess að tilgreina hvenær óskað var eftir fyrirtöku',
    },
  }),
  courtHeadsUp: defineMessages({
    arrestDateText: {
      id:
        'judicial.system.backend:notifications.court_heads_up.arrest_date_text',
      defaultMessage: 'Viðkomandi handtekinn {date}, kl. {time}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvenær varnaraðili var handtekinn',
    },
    requestedCourtDateText: {
      id:
        'judicial.system.backend:notifications.court_heads_up.requested_court_date_text',
      defaultMessage: 'ÓE fyrirtöku {date}, eftir kl. {time}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvenær óskað er eftir fyrirtöku',
    },
    newCaseText: {
      id: 'judicial.system.backend:notifications.court_heads_up.new_case_text',
      defaultMessage:
        'Ný {caseType, select, TRAVEL_BAN {farbannskrafa} ADMISSION_TO_FACILITY {krafa um vistun á viðeigandi stofnun} CUSTODY {gæsluvarðhaldskrafa} OTHER {krafa um rannsóknarheimild} other {krafa um rannsóknarheimild ({courtTypeName})}} í vinnslu.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina að mál sé komið í vinnslu',
    },
  }),
  courtReadyForCourt: defineMessages({
    submittedCase: {
      id:
        'judicial.system.backend:notifications.court_ready_for_court.case_ready_for_court',
      defaultMessage:
        '{caseType, select, TRAVEL_BAN {Farbannskrafa} ADMISSION_TO_FACILITY {Krafa um vistun á viðeigandi stofnun} CUSTODY {Gæsluvarðhaldskrafa} OTHER {Krafa um rannsóknarheimild} other {Krafa um rannsóknarheimild ({courtTypeName})}} tilbúin til afgreiðslu.',
      description:
        'Notaður sem texti í sms-i sem tilgreinir að krafa sé tilbúin til afgreiðslu',
    },
  }),
  courtResubmittedToCourt: defineMessage({
    id: 'judicial.system.backend:notifications.case_resubmitted_to_court',
    defaultMessage:
      'Sækjandi í máli {courtCaseNumber} hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði.',
    description:
      'Notaður sem texti í sms-i þegar sækjandi breytir kröfunni og sendir aftur á héraðsdómstól',
  }),
  defenderResubmittedToCourt: defineMessages({
    subject: {
      id:
        'judicial.system.backend:notifications.defender_resubmitted_to_court.subject_v3',
      defaultMessage: 'Gögn í máli {courtCaseNumber}',
      description:
        'Notaður sem titil í pósti til verjanda þegar sækjandi breytir kröfunni og sendir aftur á héraðsdómstól',
    },
    body: {
      id:
        'judicial.system.backend:notifications.defender_resubmitted_to_court.body_v3',
      defaultMessage:
        'Sækjandi í máli {courtCaseNumber} hjá {courtName} hefur breytt kröfunni og sent hana aftur á dóminn.',
      description:
        'Notaður sem texti í pósti til verjanda þegar sækjandi breytir kröfunni og sendir aftur á héraðsdómstól',
    },
    link: {
      id:
        'judicial.system.backend:notifications.defender_resubmitted_to_court.link',
      defaultMessage:
        '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins í {linkStart}Réttarvörslugátt{linkEnd} með rafrænum skilríkjum}}.',
      description:
        'Notaður sem vísun í gögn málsins í pósti til verjanda/talsmanns þegar sækjandi breytir kröfunni og sendir aftur á héraðsdómstól',
    },
  }),
  prosecutorReceivedByCourt: defineMessage({
    id: 'judicial.system.backend:notifications.prosecutor_received_by_court',
    defaultMessage:
      '{court} hefur móttekið {caseType, select, otherInvestigationCase {kröfu um rannsóknarheimild} investigationCase {kröfu um rannsóknarheimild ({caseTypeName})} restrictionCase {kröfu um {caseTypeName}} other {ákæru}} sem þú sendir og úthlutað málsnúmerinu {courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is.',
    description: 'Notaður sem texti í sms-i þegar sækjandi fær kröfuskjal',
  }),
  prosecutorCourtDateEmail: defineMessages({
    scheduledCase: {
      id:
        'judicial.system.backend:notifications.prosecutor_court_date_email.scheduled_case',
      defaultMessage:
        '{court} hefur staðfest fyrirtökutíma fyrir kröfu um {investigationPrefix, select, onlyPrefix {rannsóknarheimild} withPrefix {rannsóknarheimild ({courtTypeName})} other {{courtTypeName}}}.',
      description:
        'Notaður sem texti í pósti sem tilgreinir að dómstól hefur staðfest fyrirtökutíma',
    },
    sheduledIndictmentCase: {
      id:
        'judicial.system.backend:notifications.prosecutor_court_date_email.scheduled_indictment_case',
      defaultMessage:
        '{court} boðar til þingfestingar í máli {courtCaseNumber}.',
      description:
        'Notaður sem texti í pósti sem tilgreinir að dómstól boði til þingfestingar',
    },
    courtDate: {
      id:
        'judicial.system.backend:notifications.prosecutor_court_date_email.court_date',
      defaultMessage:
        '{isIndictment, select, true {Þingfesting} other {Fyrirtaka}} mun fara fram {courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}.',
      description:
        'Notaður sem texti í pósti sem tilgreinir hvenær fyrirtaka fer fram',
    },
    subject: {
      id:
        'judicial.system.backend:notifications.prosecutor_court_date_email.subject',
      defaultMessage:
        '{isIndictment, select, true {Þingfesting} other {Fyrirtaka}} í máli: {courtCaseNumber}',
      description:
        'Notaður sem titil á  pósti til sækjanda þegar fyrirtökutími er staðfestur',
    },
    body: {
      id:
        'judicial.system.backend:notifications.prosecutor_court_date_email.body',
      defaultMessage:
        '{scheduledCaseText}<br /><br />{courtDateText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}{sessionArrangements, select, PROSECUTOR_PRESENT {} other {<br /><br />{defenderText}.}}',
      description:
        'Notaður fyrir beinagrind á pósti til sækjanda þegar fyrirtökutími er staðfestur',
    },
    bodyIndictments: {
      id:
        'judicial.system.backend:notifications.prosecutor_court_date_email.body_indictments',
      defaultMessage:
        '{scheduledCaseText}<br /><br />{courtDateText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}',
      description:
        'Notaður fyrir beinagrind á pósti til sækjanda þegar fyrirtökutími er staðfestur í ákærum',
    },
  }),
  signedRuling: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.signed_ruling.subject',
      defaultMessage: 'Úrskurður í máli {courtCaseNumber}',
      description:
        'Notaður sem titill í pósti til hagaðila vegna undirritunar úrskurðar',
    },
    subjectV2: {
      id: 'judicial.system.backend:notifications.signed_ruling.subject_v2',
      defaultMessage:
        'Úrskurður í máli {courtCaseNumber}{isModifyingRuling, select, true { leiðrétt} other {}}',
      description:
        'Notaður sem titill í pósti til hagaðila vegna undirritunar úrskurðar',
    },
    courtRecordAttachment: {
      id:
        'judicial.system.backend:notifications.signed_ruling.court_record_attachment',
      defaultMessage: 'Þingbók {courtCaseNumber}.pdf',
      description:
        'Notaður sem nafn á þingbókarviðhengi í pósti til hagaðila vegna undirritunar úrskurðar',
    },
    prosecutorBodyS3V2: {
      id:
        'judicial.system.backend:notifications.signed_ruling.prosecutor_body_s3_v2',
      defaultMessage:
        'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til sækjanda vegna undirritunar úrskurðar ef tókst að vista úrskurð í AWS S3',
    },
    courtBody: {
      id: 'judicial.system.backend:notifications.signed_ruling.court_body',
      defaultMessage:
        'Ekki tókst að vista þingbók og/eða úrskurð í máli {courtCaseNumber} í Auði.<br /><br />Skjöl málsins eru aðengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til dómara og dómritara vegna undirritunar úrskurðar ef ekki tókst að vista þingbók eða úrskurð í Auði',
    },
    defenderBodyV2: {
      id:
        'judicial.system.backend:notifications.signed_ruling.defender_body_v2',
      defaultMessage:
        'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {{signedVerdictAvailableInS3, select, false {Þú getur nálgast undirritaðan úrskurð hjá {courtName} ef upp koma vandamál við að sækja hann í {linkStart}Réttarvörslugátt{linkEnd}} other {Þú getur nálgast gögn málsins í {linkStart}Réttarvörslugátt{linkEnd} með rafrænum skilríkjum}}}}.',
      description:
        'Notaður sem texti í pósti til verjanda/talsmanns vegna undirritunar úrskurðar',
    },
    prisonAdminBody: {
      id:
        'judicial.system.backend:notifications.signed_ruling.prison_admin_body',
      defaultMessage:
        'Dómari hefur undirritað og staðfest úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til Fangelsismálastofnun vegna undirritunar úrskurðar',
    },
  }),
  caseCompleted: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_completed.subject',
      defaultMessage: 'Dómur í máli {courtCaseNumber}',
      description:
        'Notaður sem titill í pósti til hagaðila vegna staðfests dóms',
    },
    prosecutorBody: {
      id:
        'judicial.system.backend:notifications.case_completed.prosecutor_body',
      defaultMessage:
        'Dómari hefur staðfestur dóm í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til sækjanda vegna staðfests dóms',
    },
    defenderBody: {
      id: 'judicial.system.backend:notifications.case_completed.defender_body',
      defaultMessage:
        'Dómari hefur staðfest dóm í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins í {linkStart}Réttarvörslugátt{linkEnd} með rafrænum skilríkjum}}.',
      description:
        'Notaður sem texti í pósti til verjanda vegna staðfests dóms',
    },
  }),
  prisonCourtDateEmail: defineMessages({
    isolationTextV2: {
      id:
        'judicial.system.backend:notifications.prison_court_date_email.isolation_text_v2',
      defaultMessage:
        '{isolation, select, false {Ekki er farið fram á einangrun} other {Farið er fram á einangrun}}.',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hvort farið er fram á einangrun',
    },
    courtDateText: {
      id:
        'judicial.system.backend:notifications.prison_court_date_email.court_date_text',
      defaultMessage:
        '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
      description:
        'Texti í pósti til fangelsis sem tilgreinir hvernær mál verður tekið fyrir.',
    },
    requestText: {
      id:
        'judicial.system.backend:notifications.prison_court_date_email.request_text',
      defaultMessage:
        'Nafn sakbornings: {accusedName, select, NONE {Ekki skráð} other {{accusedName}}}.<br /><br />Kyn sakbornings: {gender, select, MALE {Karl} FEMALE {Kona} other {Kynsegin/Annað}}.<br /><br />Krafist er {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}} til {requestedValidToDateText}.',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hver sakborningur er',
    },
    courtText: {
      id:
        'judicial.system.backend:notifications.prison_court_date_email.court_text',
      defaultMessage:
        '{court, select, NONE {ótilgreinds dómstóls} other {{court}}}',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hvaða dómstóll dæmir í máli',
    },
    requestedValidToDateText: {
      id:
        'judicial.system.backend:notifications.prison_court_date_email.requested_valid_to_date_text',
      defaultMessage:
        '{requestedValidToDate, select, NONE {ótilgreinds tíma} other {{requestedValidToDate}}}',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hversu lengi gæsluvarðhandls er krafist',
    },
    bodyV2: {
      id:
        'judicial.system.backend:notifications.prison_court_date_email.body_v2',
      defaultMessage:
        '{prosecutorOffice, select, NONE {Ótilgreindur sækjandi} other {{prosecutorOffice}}} hefur sent kröfu um {isExtension, select, true {áframhaldandi } other {}}{caseType, select, ADMISSION_TO_FACILITY {vistunar á viðeignadi stofnun} other {gæsluvarðhald}} til {courtText} og verður málið tekið fyrir {courtDateText}.<br /><br />{requestText}<br /><br />{isolationText}<br /><br />{defenderText}.',
      description: 'Notaður sem beinagrind á í pósti til fangelsis',
    },
    subject: {
      id:
        'judicial.system.backend:notifications.prison_court_date_email.subject',
      defaultMessage:
        'Krafa um {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhald}} í vinnslu',
      description: 'Fyrirsögn í pósti til fangeslis þegar krafa fer í vinnslu',
    },
  }),
  prisonRulingEmail: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.prison_ruling_email.subject',
      defaultMessage:
        'Úrskurður um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}}',
      description:
        'Fyrirsögn í pósti til fangeslis þegar vistunarseðill og þingbók eru send',
    },
    body: {
      id: 'judicial.system.backend:notifications.prison_ruling_email',
      defaultMessage:
        'Meðfylgjandi er vistunarseðill aðila sem var úrskurðaður í {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}} í héraðsdómi {courtEndTime, select, NONE {á ótilgreindum tíma} other {{courtEndTime}}}, auk þingbókar þar sem úrskurðarorðin koma fram.',
      description:
        'Texti í pósti til fangelis þegar vistunarseðill og þingbók eru send',
    },
  }),
  prisonRevokedEmail: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.prison_revoked_email.subject',
      defaultMessage:
        '{caseType, select, ADMISSION_TO_FACILITY {Krafa um vistun á viðeignadi stofnun} other {Gæsluvarðhaldskrafa}} afturkölluð',
      description: 'Fyrirsögn í pósti til fangeslis þegar krafa er afturkölluð',
    },
    revokedCaseV2: {
      id:
        'judicial.system.backend:notifications.prison_revoked_email.revoked_case_v2',
      defaultMessage:
        '{prosecutorOffice, select, NONE {Ótilgreindur sækjandi} other {{prosecutorOffice}}} hefur afturkallað kröfu um {isExtension, select, true {áframhaldandi } other {}}{caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhald}} sem send var til {courtText} og taka átti fyrir {courtDateText}.',
      description:
        'Texti í pósti til fangelsis þegar sækjandi afturkallar kröfu',
    },
    court: {
      id: 'judicial.system.backend:notifications.prison_revoked_email.court',
      defaultMessage:
        '{court, select, NONE {ótilgreinds dómstóls} other {{court}}}',
      description:
        'Texti í pósti til fangelsis sem tilgreinir hvaða dómstóll átti að dæma í máli sem hefur verið afturkallað',
    },
    courtDate: {
      id:
        'judicial.system.backend:notifications.prison_revoked_email.court_date_text',
      defaultMessage:
        '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
      description:
        'Texti í pósti til fangelsis sem tilgreinir hvernær fyrirtaka átti að fara fram í afturkallaðri kröfu',
    },
    body: {
      id: 'judicial.system.backend:notifications.prison_revoked_email.body',
      defaultMessage:
        '{revokedCaseText}<br /><br />{accusedNameText}<br /><br />{defenderText}',
      description:
        'Notaður sem beinagrind á pósti til fangelsis þegar krafa er afturkölluð',
    },
    defender: {
      id: 'judicial.system.backend:notifications.prison_revoked_email.defender',
      defaultMessage:
        'Verjandi sakbornings{defenderName, select, NONE { hefur ekki verið skráður} other {: {defenderName}}}.',
      description:
        'Texti í pósti til fangelsis sem tilgreinir hver verjandi sakbornings er',
    },
  }),
  defenderCourtDateEmail: defineMessages({
    sessionArrangements: {
      id:
        'judicial.system.backend:notifications.defender_court_date_email.session_arrangements',
      defaultMessage:
        '{court} hefur boðað þig í fyrirtöku sem {sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {talsmann} other {verjanda}} sakbornings.',
      description:
        'Texti í pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    courtDate: {
      id:
        'judicial.system.backend:notifications.defender_court_date_email.court_date',
      defaultMessage:
        'Fyrirtaka mun fara fram {courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir hvernær fyrirtaka mun fara fram',
    },
    courtCaseNumber: {
      id:
        'judicial.system.backend:notifications.defender_court_date_email.court_case_number',
      defaultMessage: 'Málsnúmer: {courtCaseNumber}.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinr málsnúmer',
    },
    prosecutor: {
      id:
        'judicial.system.backend:notifications.defender_court_date_email.prosecutor',
      defaultMessage: 'Sækjandi: {prosecutorName} ({prosecutorInstitution}).',
      description:
        'Texti í pósti til verjanda/talsmans sem tilgreinir hver sækjandi er',
    },
    body: {
      id:
        'judicial.system.backend:notifications.defender_court_date_email.body',
      defaultMessage:
        '{sessionArrangementsText}<br /><br />{courtDateText}<br /><br />{courtCaseNumberText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}<br /><br />{prosecutorText}',
      description:
        'Notaður sem beinagrind á pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    linkBody: {
      id:
        'judicial.system.backend:notifications.defender_court_date_email.link_body',
      defaultMessage:
        'Sækjandi hefur valið að deila kröfu með þér sem verjanda sakbornings í máli {courtCaseNumber}.',
      description:
        'Notaður sem beinagrind á pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    link: {
      id:
        'judicial.system.backend:notifications.defender_court_date_email.link',
      defaultMessage:
        '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins í {linkStart}Réttarvörslugátt{linkEnd} með rafrænum skilríkjum}}.',
      description:
        'Notaður sem vísun í gögn málsins í pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
  }),
  defenderRevokedEmail: defineMessages({
    court: {
      id: 'judicial.system.backend:notifications.defender_revoked_email.court',
      defaultMessage:
        '{court, select, NONE {ótilgreindum dómstóli} other {{court}}}',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir hvaða dómstóll dæmir í máli',
    },
    courtDate: {
      id:
        'judicial.system.backend:notifications.defender_revoked_email.court_date',
      defaultMessage:
        '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir hvernær fyrirtaka var skráð',
    },
    revoked: {
      id:
        'judicial.system.backend:notifications.defender_revoked_email.revoked',
      defaultMessage:
        'Krafa um {investigationPrefix, select, onlyPrefix {rannsóknarheimild} withPrefix {rannsóknarheimild ({courtTypeName})} other {{courtTypeName}}} sem taka átti fyrir hjá {courtText} {courtDateText}, hefur verið afturkölluð.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir að krafa sé afturkölluð',
    },
    defendant: {
      id:
        'judicial.system.backend:notifications.defender_revoked_email.defendant',
      defaultMessage:
        'Sakborningur: {defendantName, select, NONE {Nafn ekki skráð} other {{defendantName}}}{defendantNoNationalId, select, NONE {{defendantNationalId, select, NONE {} other {, fd. {defendantNationalId}}}} other {, kt. {defendantNationalId, select, NONE {ekki skráð} other {{defendantNationalId}}}}}.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir sakborning',
    },
    defenderAssigned: {
      id:
        'judicial.system.backend:notifications.defender_revoked_email.defender_assigned',
      defaultMessage: 'Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir að viðkomandi sé skráður verjandi',
    },
    body: {
      id: 'judicial.system.backend:notifications.defender_revoked_email.body',
      defaultMessage:
        '{revokedText}<br /><br />{defendantText}<br /><br />{defenderAssignedText}',
      description:
        'Notaður sem beinagrind á pósti til verjanda/talsmanns þegar krafa er afturkölluð',
    },
    subject: {
      id:
        'judicial.system.backend:notifications.defender_revoked_email.subject',
      defaultMessage:
        'Krafa um {caseType, select, CUSTODY {gæsluvarðhald} TRAVEL_BAN {farbann} ADMISSION_TO_FACILITY {vistun} other {rannsóknarheimild}} afturkölluð',
      description:
        'Fyrirsögn í pósti til verjanda/talsmanns /egar krafa er afturkölluð',
    },
  }),
  modified: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.modified.subject',
      defaultMessage:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistunarmál} other {Gæsluvarðhaldsmál}} {courtCaseNumber}',
      description:
        'Notaður sem titill á tölvupósti vegna breytingar á lengd gæslu/einangrunar/vistunar þar sem {courtCaseNumber} er málsnúmer dómstóls.',
    },
    html: {
      id: 'judicial.system.backend:notifications.modified.html',
      defaultMessage:
        '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}} í máli {courtCaseNumber}. Sjá {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.<br /><br />Lok {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}}: {validToDate}.',
      description:
        'Notaður sem texti í tölvupósti vegna breytingar á lengd gæslu/vistunar þar sem ekki var úrskurðað í einangrun.',
    },
    isolationHtml: {
      id: 'judicial.system.backend:notifications.modified.isolation_html',
      defaultMessage:
        '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}}/einangrunar í máli {courtCaseNumber}. Sjá {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.<br /><br />Lok {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}}: {validToDate}.<br /><br />Lok einangrunar: {isolationToDate}.',
      description:
        'Notaður sem texti í tölvupósti vegna breytingar á lengd gæslu/einangrunar/vistunar þar sem úrskurðað var í einangrun.',
    },
  }),
  defenderAssignedEmail: defineMessages({
    subject: {
      id:
        'judicial.system.backend:notifications.defender_assigned_email.subject',
      defaultMessage: '{court} - aðgangur að málsgögnum',
      description:
        'Fyrirsögn í pósti til verjanda þegar hann er skráður á mál.',
    },
    // TODO: REMOVE body
    body: {
      id: 'judicial.system.backend:notifications.defender_assigned_email.body',
      defaultMessage:
        '{court} hefur skipað þig verjanda í máli {linkStart}{courtCaseNumber}{linkEnd}. Gögn málsins eru aðgengileg í Réttarvörslugátt með rafrænum skilríkjum.',
      description: 'Texti í pósti til verjanda þegar hann er skráður á mál.',
    },
    bodyV2: {
      id:
        'judicial.system.backend:notifications.defender_assigned_email.body_v2',
      defaultMessage:
        '{court} hefur skipað þig verjanda í máli {courtCaseNumber}.<br /><br />{defenderHasAccessToRVG, select, true {Gögn málsins eru aðgengileg í {linkStart}Réttarvörslugátt{linkEnd} með rafrænum skilríkjum} other {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til verjanda þegar hann er skráður á mál.',
    },
  }),
}
