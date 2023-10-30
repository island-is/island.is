import { defineMessage, defineMessages } from '@formatjs/intl'

export const notifications = {
  defender: defineMessage({
    id: 'judicial.system.backend:notifications.defender',
    defaultMessage:
      '{sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {Talsmaður} other {Verjandi}} sakbornings{defenderName, select, NONE { hefur ekki verið skráður} other {: {defenderName}}}',
    description:
      'Texti í pósti sem tilgreinir hver talsmaður/verjandi er í máli.',
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
    investigationCaseReadyForCourtSubject: {
      id: 'judicial.system.backend:notifications.ready_for_court.investigation_case_ready_for_court',
      defaultMessage: 'Krafa um rannsóknarheimild send ({caseType})',
      description:
        'Titill í pósti til ákæranda þegar rannsóknarheimild er send',
    },
    prosecutorHtml: {
      id: 'judicial.system.backend:notifications.ready_for_court.prosecutor_html_v3',
      defaultMessage:
        'Þú hefur sent {isIndictmentCase, select, true {ákæru} other {kröfu}} á {courtName} vegna LÖKE {policeCaseNumbersCount, plural, zero {máls} one {máls {policeCaseNumbers}} other {mála: {policeCaseNumbers}}}. Skjalið er aðgengilegt undir {linkStart}málinu í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til ákæranda varðandi kröfu sem hefur verið send á héraðsdómara',
    },
  }),
  courtRevoked: defineMessages({
    caseTypeRevoked: {
      id: 'judicial.system.backend:notifications.court_revoked.case_type_revoked',
      defaultMessage:
        '{caseType, select, TRAVEL_BAN {Farbannskrafa} ADMISSION_TO_FACILITY {Krafa um vistun á viðeigandi stofnun} other {Gæsluvarðhaldskrafa}} afturkölluð.',
      description:
        'Notaður sem texti í sms-i til dómstóla þegar krafa er afturkölluð',
    },
    investigationCaseRevoked: {
      id: 'judicial.system.backend:notifications.court_revoked.case_revoked',
      defaultMessage: 'Rannsóknarheimild afturkölluð.',
      description:
        'Notaður sem texti í sms-i til dómstóla þegar rannsóknarheimild er afturkölluð',
    },
    courtDate: {
      id: 'judicial.system.backend:notifications.court_revoked.court_date',
      defaultMessage: 'Fyrirtökutími: {date}, kl. {time}.',
      description:
        'Notaður sem texti í afturköllunar sms-i til dómstóla til þess að tilgreina hvenær fyrirtaka átti að vera',
    },
    requestedCourtDate: {
      id: 'judicial.system.backend:notifications.court_revoked.requested_court_date',
      defaultMessage: 'ÓVE fyrirtöku {date}, eftir kl. {time}.',
      description:
        'Notaður sem texti í afturköllunar sms-i til þess að tilgreina hvenær óskað var eftir fyrirtöku',
    },
  }),
  courtHeadsUp: defineMessages({
    arrestDateText: {
      id: 'judicial.system.backend:notifications.court_heads_up.arrest_date_text',
      defaultMessage: 'Viðkomandi handtekinn {date}, kl. {time}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvenær varnaraðili var handtekinn',
    },
    requestedCourtDateText: {
      id: 'judicial.system.backend:notifications.court_heads_up.requested_court_date_text',
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
  defenderReadyForCourtSubject: defineMessage({
    id: 'judicial.system.backend:notifications.defender_ready_for_court.subject',
    defaultMessage: 'Krafa í máli {policeCaseNumber}',
    description:
      'Notaður sem titill í pósti til verjanda þegar ný krafa er tilbúin til afgreiðslu',
  }),
  defenderReadyForCourtBody: defineMessage({
    id: 'judicial.system.backend:notifications.defender_ready_for_court.body',
    defaultMessage:
      'Sækjandi hefur valið að deila kröfu með þér sem verjanda varnaraðila í máli {policeCaseNumber}.',
    description:
      'Notaður sem texti í pósti til verjanda þegar ný krafa er tilbúin til afgreiðslu',
  }),
  defenderLink: defineMessage({
    id: 'judicial.system.backend:notifications.defender_link',
    defaultMessage:
      '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast málið hjá {courtName}} other {Þú getur nálgast málið á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
    description:
      'Notaður sem vísun í gögn málsins í pósti til verjanda/talsmanns',
  }),
  indictmentCourtReadyForCourt: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.indictment_court_ready_for_court.subject',
      defaultMessage: 'Ákæra tilbúin til afgreiðslu',
      description:
        'Notaður sem titill í pósti til dómstóla þegar ný ákæra er tilbúin til afgreiðslu',
    },
    body: {
      id: 'judicial.system.backend:notifications.indictment_court_ready_for_court.body',
      defaultMessage:
        '{prosecutorName} hefur sent inn nýja ákæru. Ákæran varðar eftirfarandi brot: {indictmentSubtypes}. Ákæran og öll skjöl málsins eru {linkStart}aðgengileg í Réttarvörslugátt.{linkEnd}',
      description:
        'Notaður sem texti í pósti til dómstóla þegar ný ákæra er tilbúin til afgreiðslu',
    },
  }),
  courtReadyForCourt: defineMessages({
    submittedCase: {
      id: 'judicial.system.backend:notifications.court_ready_for_court.case_ready_for_court',
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
      id: 'judicial.system.backend:notifications.defender_resubmitted_to_court.subject_v3',
      defaultMessage: 'Gögn í máli {courtCaseNumber}',
      description:
        'Notaður sem titil í pósti til verjanda þegar sækjandi breytir kröfunni og sendir aftur á héraðsdómstól',
    },
    body: {
      id: 'judicial.system.backend:notifications.defender_resubmitted_to_court.body_v3',
      defaultMessage:
        'Sækjandi í máli {courtCaseNumber} hjá {courtName} hefur breytt kröfunni og sent hana aftur á dóminn.',
      description:
        'Notaður sem texti í pósti til verjanda þegar sækjandi breytir kröfunni og sendir aftur á héraðsdómstól',
    },
    link: {
      id: 'judicial.system.backend:notifications.defender_resubmitted_to_court.link_v3',
      defaultMessage:
        '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
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
      id: 'judicial.system.backend:notifications.prosecutor_court_date_email.scheduled_case',
      defaultMessage:
        '{court} hefur staðfest fyrirtökutíma fyrir kröfu um {investigationPrefix, select, onlyPrefix {rannsóknarheimild} withPrefix {rannsóknarheimild ({courtTypeName})} other {{courtTypeName}}}.',
      description:
        'Notaður sem texti í pósti sem tilgreinir að dómstól hefur staðfest fyrirtökutíma',
    },
    sheduledIndictmentCase: {
      id: 'judicial.system.backend:notifications.prosecutor_court_date_email.scheduled_indictment_case',
      defaultMessage:
        '{court} boðar til þingfestingar í máli {courtCaseNumber}.',
      description:
        'Notaður sem texti í pósti sem tilgreinir að dómstól boði til þingfestingar',
    },
    courtDate: {
      id: 'judicial.system.backend:notifications.prosecutor_court_date_email.court_date',
      defaultMessage:
        '{isIndictment, select, true {Þingfesting} other {Fyrirtaka}} mun fara fram {courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}.',
      description:
        'Notaður sem texti í pósti sem tilgreinir hvenær fyrirtaka fer fram',
    },
    subject: {
      id: 'judicial.system.backend:notifications.prosecutor_court_date_email.subject',
      defaultMessage:
        '{isIndictment, select, true {Þingfesting} other {Fyrirtaka}} í máli: {courtCaseNumber}',
      description:
        'Notaður sem titil á  pósti til sækjanda þegar fyrirtökutími er staðfestur',
    },
    body: {
      id: 'judicial.system.backend:notifications.prosecutor_court_date_email.body_v3',
      defaultMessage:
        '{sessionArrangements, select, NONE_PRESENT {Krafan verður tekin fyrir án boðunar í þinghald.<br /><br />} other {}}{scheduledCaseText}<br /><br />{courtDateText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}{sessionArrangements, select, PROSECUTOR_PRESENT {} NONE_PRESENT {} other {<br /><br />{defenderText}.}}',
      description:
        'Notaður fyrir beinagrind á pósti til sækjanda þegar fyrirtökutími er staðfestur',
    },
    bodyIndictments: {
      id: 'judicial.system.backend:notifications.prosecutor_court_date_email.body_indictments',
      defaultMessage:
        '{scheduledCaseText}<br /><br />{courtDateText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}',
      description:
        'Notaður fyrir beinagrind á pósti til sækjanda þegar fyrirtökutími er staðfestur í ákærum',
    },
  }),
  signedRuling: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.signed_ruling.subject_v2',
      defaultMessage:
        'Úrskurður í máli {courtCaseNumber}{isModifyingRuling, select, true { leiðréttur} other {}}',
      description:
        'Notaður sem titill í pósti til hagaðila vegna undirritunar úrskurðar',
    },
    courtRecordAttachment: {
      id: 'judicial.system.backend:notifications.signed_ruling.court_record_attachment',
      defaultMessage: 'Þingbók {courtCaseNumber}.pdf',
      description:
        'Notaður sem nafn á þingbókarviðhengi í pósti til hagaðila vegna undirritunar úrskurðar',
    },
    prosecutorBodyS3: {
      id: 'judicial.system.backend:notifications.signed_ruling.prosecutor_body_s3_v2',
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
    defenderBody: {
      id: 'judicial.system.backend:notifications.signed_ruling.defender_body_v4',
      defaultMessage:
        'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
      description:
        'Notaður sem texti í pósti til verjanda/talsmanns vegna undirritunar úrskurðar',
    },
    prisonAdminBody: {
      id: 'judicial.system.backend:notifications.signed_ruling.prison_admin_body_v2',
      defaultMessage:
        'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
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
      id: 'judicial.system.backend:notifications.case_completed.prosecutor_body',
      defaultMessage:
        'Dómari hefur staðfest dóm í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til sækjanda vegna staðfests dóms',
    },
    defenderBody: {
      id: 'judicial.system.backend:notifications.case_completed.defender_body_v2',
      defaultMessage:
        'Dómari hefur staðfest dóm í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
      description:
        'Notaður sem texti í pósti til verjanda vegna staðfests dóms',
    },
  }),
  prisonCourtDateEmail: defineMessages({
    isolationTextV2: {
      id: 'judicial.system.backend:notifications.prison_court_date_email.isolation_text_v2',
      defaultMessage:
        '{isolation, select, false {Ekki er farið fram á einangrun} other {Farið er fram á einangrun}}.',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hvort farið er fram á einangrun',
    },
    courtDateText: {
      id: 'judicial.system.backend:notifications.prison_court_date_email.court_date_text',
      defaultMessage:
        '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
      description:
        'Texti í pósti til fangelsis sem tilgreinir hvernær mál verður tekið fyrir.',
    },
    requestText: {
      id: 'judicial.system.backend:notifications.prison_court_date_email.request_textv2',
      defaultMessage:
        'Kyn sakbornings: {gender, select, MALE {Karl} FEMALE {Kona} other {Kynsegin/Annað}}.<br /><br />Krafist er {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}} til {requestedValidToDateText}.',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hver sakborningur er',
    },
    courtText: {
      id: 'judicial.system.backend:notifications.prison_court_date_email.court_text',
      defaultMessage:
        '{court, select, NONE {ótilgreinds dómstóls} other {{court}}}',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hvaða dómstóll dæmir í máli',
    },
    requestedValidToDateText: {
      id: 'judicial.system.backend:notifications.prison_court_date_email.requested_valid_to_date_text',
      defaultMessage:
        '{requestedValidToDate, select, NONE {ótilgreinds tíma} other {{requestedValidToDate}}}',
      description:
        'Texti í pósti til fangeslis sem tilgreinir hversu lengi gæsluvarðhandls er krafist',
    },
    body: {
      id: 'judicial.system.backend:notifications.prison_court_date_email.body_v3',
      defaultMessage:
        '{prosecutorOffice, select, NONE {Ótilgreindur sækjandi} other {{prosecutorOffice}}} hefur sent kröfu um {isExtension, select, true {áframhaldandi } other {}}{caseType, select, ADMISSION_TO_FACILITY {vistunar á viðeignadi stofnun} other {gæsluvarðhald}} til {courtText} og verður málið tekið fyrir {courtDateText}.<br /><br />{requestText}<br /><br />{isolationText}<br /><br />{defenderText}.<br /><br />Málsnúmer héraðsdóms er {courtCaseNumber}.',
      description: 'Notaður sem beinagrind á í pósti til fangelsis',
    },
    subject: {
      id: 'judicial.system.backend:notifications.prison_court_date_email.subject_v3',
      defaultMessage:
        'Krafa {courtCaseNumber} um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeignadi stofnun} other {gæsluvarðhald}} í vinnslu',
      description: 'Fyrirsögn í pósti til fangeslis þegar krafa fer í vinnslu',
    },
  }),
  prisonRulingEmail: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.prison_ruling_email.subject_v3',
      defaultMessage:
        '{isModifyingRuling, select, true {Úrskurður leiðréttur} other {Úrskurður}} í máli {courtCaseNumber}',
      description:
        'Fyrirsögn í pósti til fangeslis þegar vistunarseðill og þingbók eru send',
    },
    body: {
      id: 'judicial.system.backend:notifications.prison_ruling_email.body_v4',
      defaultMessage:
        '{institutionName} hefur úrskurðað aðila í {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}}{isModifyingRuling, select, true {} other { í þinghaldi sem lauk rétt í þessu}}. Hægt er að nálgast þingbók og vistunarseðil á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description: 'Texti í pósti til fangelsis með link á réttarvörslugátt',
    },
    paroleRevocationBody: {
      id: 'judicial.system.backend:notifications.prison_ruling_email.parole_revocation_body',
      defaultMessage:
        '{institutionName} hefur rofið reynslulausn aðila með úrskurði í máli {courtCaseNumber}. Hægt er að nálgast þingbók á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description: 'Texti í pósti til fangelsis með link á réttarvörslugátt',
    },
  }),
  prisonRevokedEmail: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.prison_revoked_email.subject_v2',
      defaultMessage:
        'Krafa {courtCaseNumber} um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeignadi stofnun} other {gæsluvarðhald}} afturkölluð',
      description: 'Fyrirsögn í pósti til fangeslis þegar krafa er afturkölluð',
    },
    revokedCase: {
      id: 'judicial.system.backend:notifications.prison_revoked_email.revoked_case_v2',
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
      id: 'judicial.system.backend:notifications.prison_revoked_email.court_date_text',
      defaultMessage:
        '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
      description:
        'Texti í pósti til fangelsis sem tilgreinir hvernær fyrirtaka átti að fara fram í afturkallaðri kröfu',
    },
    body: {
      id: 'judicial.system.backend:notifications.prison_revoked_email.body_v2',
      defaultMessage:
        '{revokedCaseText}<br /><br />{defenderText}<br /><br />Málsnúmer héraðsdóms er {courtCaseNumber}.',
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
  rejectedCustodyEmail: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.rejected_custody_email.subject_v3',
      defaultMessage:
        '{isModifyingRuling, select, true {Úrskurður leiðréttur í máli {courtCaseNumber}} other {Kröfu {courtCaseNumber} um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}} hafnað}}',
      description: 'Fyrirsögn í pósti til fangelsis þegar kröfu er hafnað',
    },
    body: {
      id: 'judicial.system.backend:notifications.rejected_custody_email.body_v2',
      defaultMessage:
        '{court} hefur hafnað kröfu um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}} með málsnúmerið {courtCaseNumber}.',
      description: 'Texti í pósti til fangelsis þegar kröfu er hafnað',
    },
  }),
  defenderCourtDateEmail: defineMessages({
    sessionArrangements: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.session_arrangements',
      defaultMessage:
        '{court} hefur boðað þig í fyrirtöku sem {sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {talsmann} other {verjanda}} sakbornings.',
      description:
        'Texti í pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    courtDate: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.court_date',
      defaultMessage:
        'Fyrirtaka mun fara fram {courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir hvernær fyrirtaka mun fara fram',
    },
    courtCaseNumber: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.court_case_number',
      defaultMessage: 'Málsnúmer: {courtCaseNumber}.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinr málsnúmer',
    },
    prosecutor: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.prosecutor',
      defaultMessage: 'Sækjandi: {prosecutorName} ({prosecutorInstitution}).',
      description:
        'Texti í pósti til verjanda/talsmans sem tilgreinir hver sækjandi er',
    },
    body: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.body',
      defaultMessage:
        '{sessionArrangementsText}<br /><br />{courtDateText}<br /><br />{courtCaseNumberText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}<br /><br />{prosecutorText}',
      description:
        'Notaður sem beinagrind á pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    linkBody: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.link_body',
      defaultMessage:
        'Sækjandi hefur valið að deila kröfu með þér sem verjanda sakbornings í máli {courtCaseNumber}.',
      description:
        'Notaður sem beinagrind á pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    link: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.link_v2',
      defaultMessage:
        '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
      description:
        'Notaður sem vísun í gögn málsins í pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    linkNoRequestBody: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.link_no_request_body_v2',
      defaultMessage:
        '{courtName} hefur skráð þig sem verjanda/talsmann sakbornings í máli {courtCaseNumber}.',
      description:
        'Notaður sem beinagrind á pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
    },
    linkNoRequest: {
      id: 'judicial.system.backend:notifications.defender_court_date_email.link_no_request_v2',
      defaultMessage:
        '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast yfirlit málsins hjá {courtName} ef það hefur ekki þegar verið afhent} other {Þú getur nálgast yfirlit málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
      description:
        'Notaður sem vísun í yfirlit málsins í pósti til verjanda/talsmanns þegar dómstóll boðar í fyrirtöku',
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
      id: 'judicial.system.backend:notifications.defender_revoked_email.court_date',
      defaultMessage:
        '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir hvernær fyrirtaka var skráð',
    },
    revoked: {
      id: 'judicial.system.backend:notifications.defender_revoked_email.revoked',
      defaultMessage:
        'Krafa um {investigationPrefix, select, onlyPrefix {rannsóknarheimild} withPrefix {rannsóknarheimild ({courtTypeName})} other {{courtTypeName}}} sem taka átti fyrir hjá {courtText} {courtDateText}, hefur verið afturkölluð.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir að krafa sé afturkölluð',
    },
    revokedIndictment: {
      id: 'judicial.system.backend:notifications.defender_revoked_email.revoked_indictment',
      defaultMessage:
        'Ákæra sem taka átti fyrir hjá {courtText} {courtDateText}, hefur verið afturkölluð.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir að ákæra sé afturkölluð',
    },
    defendant: {
      id: 'judicial.system.backend:notifications.defender_revoked_email.defendant',
      defaultMessage:
        'Sakborningur: {defendantName, select, NONE {Nafn ekki skráð} other {{defendantName}}}{defendantNoNationalId, select, NONE {{defendantNationalId, select, NONE {} other {, fd. {defendantNationalId}}}} other {, kt. {defendantNationalId, select, NONE {ekki skráð} other {{defendantNationalId}}}}}.',
      description:
        'Texti í pósti til verjanda/talsmanns sem tilgreinir sakborning',
    },
    defenderAssignedV2: {
      id: 'judicial.system.backend:notifications.defender_revoked_email.defender_assigned_v2',
      defaultMessage: 'Dómstóllinn hafði skráð þig sem verjanda í málinu.',
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
      id: 'judicial.system.backend:notifications.defender_revoked_email.subject',
      defaultMessage:
        'Krafa um {caseType, select, CUSTODY {gæsluvarðhald} TRAVEL_BAN {farbann} ADMISSION_TO_FACILITY {vistun} other {rannsóknarheimild}} afturkölluð',
      description:
        'Fyrirsögn í pósti til verjanda/talsmanns þegar krafa er afturkölluð',
    },
    indictmentSubject: {
      id: 'judicial.system.backend:notifications.defender_revoked_email.indictment_subject',
      defaultMessage: 'Ákæra afturkölluð',
      description:
        'Fyrirsögn í pósti til verjanda/talsmanns þegar ákæra er afturkölluð',
    },
  }),
  modified: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.modified.subject_V2',
      defaultMessage:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistunarmál} TRAVEL_BAN {Farbann} other {Gæsluvarðhaldsmál}} {courtCaseNumber}',
      description:
        'Notaður sem titill á tölvupósti vegna breytingar á lengd gæslu/einangrunar/farbanns/vistunar þar sem {courtCaseNumber} er málsnúmer dómstóls.',
    },
    html: {
      id: 'judicial.system.backend:notifications.modified.html_v2',
      defaultMessage:
        '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæsluvarðhalds}} í máli {courtCaseNumber}. Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.<br /><br />Ný lokadagsetning: {validToDate}.',
      description:
        'Notaður sem texti í tölvupósti vegna breytingar á lengd gæslu/farbanns/vistunar þar sem ekki var úrskurðað í einangrun.',
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
      id: 'judicial.system.backend:notifications.defender_assigned_email.subject',
      defaultMessage: '{court} - aðgangur að málsgögnum',
      description:
        'Fyrirsögn í pósti til verjanda þegar hann er skráður á mál.',
    },
    body: {
      id: 'judicial.system.backend:notifications.defender_assigned_email.body_v3',
      defaultMessage:
        '{court} hefur skráð þig verjanda í máli {courtCaseNumber}.<br /><br />{defenderHasAccessToRVG, select, true {Gögn málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til verjanda þegar hann er skráður á mál.',
    },
  }),
  defendantsNotUpdatedAtCourt: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.defendants_not_updated_at_court.subject',
      defaultMessage: 'Skráning varnaraðila/verjenda í máli {courtCaseNumber}',
      description:
        'Fyrirsögn í pósti til dómara og dómritara þegar ekki tekst að skrá varnaraðila/verjendur á mál.',
    },
    body: {
      id: 'judicial.system.backend:notifications.defendants_not_updated_at_court.body',
      defaultMessage:
        'Ekki tókst að skrá varnaraðila/verjendur í máli {courtCaseNumber} í Auði. Yfirfara þarf málið í Auði og skrá rétta aðila áður en því er lokað.',
      description:
        'Texti í pósti til dómara og dómritara þegar ekki tekst að skrá varnaraðila/verjendur á mál.',
    },
  }),
  caseAppealedToCourtOfAppeals: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appealed_to_court_of_appeals.subject',
      defaultMessage: 'Kæra í máli {courtCaseNumber}',
      description:
        'Fyrirsögn í pósti til dómara og dómritara þegar að mál er kært til landsréttar',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appealed_to_court_of_appeals.body_v3',
      defaultMessage:
        'Úrskurður hefur verið kærður í máli {courtCaseNumber}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description:
        'Texti í pósti til dómara og dómritara þegar að mál er kært til landsréttar',
    },
    text: {
      id: 'judicial.system.backend:notifications.case_appealed_to_court_of_appeals.text',
      defaultMessage:
        'Úrskurður hefur verið kærður í máli {courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is',
      description:
        'Texti í SMS-i á vaktsíma dómara eða dómritara þegar að mál er kært til landsréttar',
    },
  }),
  caseAppealReceivedByCourt: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_received_by_court.subject',
      defaultMessage: 'Upplýsingar vegna kæru í máli {courtCaseNumber}',
      description: 'Fyrirsögn í pósti til aðila máls þegar að kæra er móttekin',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_received_by_court.body_v3',
      defaultMessage:
        'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. {userHasAccessToRVG, select, true {Hægt er að skila greinargerð og nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að skila greinargerð og nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til aðila máls þegar að kæra er móttekin',
    },
    courtOfAppealsBody: {
      id: 'judicial.system.backend:notifications.case_appeal_received_by_court.court_of_appeals_body_v3',
      defaultMessage:
        'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description: 'Texti í pósti til Landsréttar þegar að kæra er móttekin',
    },
  }),
  caseAppealStatement: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_statement.subject',
      defaultMessage:
        'Ný greinargerð í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { ({appealCaseNumber})}}',
      description: 'Fyrirsögn í pósti til aðila máls þegar greinargerð er send',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_statement.body_v2',
      defaultMessage:
        'Greinargerð hefur borist vegna kæru í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { (Landsréttarmál nr. {appealCaseNumber})}}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til aðila máls þegar greinargerð er send',
    },
  }),
  caseAppealCompleted: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_completed.subject',
      defaultMessage:
        'Úrskurður í landsréttarmáli {appealCaseNumber} ({courtCaseNumber})',
      description: 'Fyrirsögn í pósti til aðila máls þegar kæru er lokið',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_completed.body_v2',
      defaultMessage:
        'Landsréttur hefur úrskurðað í máli {appealCaseNumber} (héraðsdómsmál nr. {courtCaseNumber}). {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til aðila máls þegar kæru er lokið',
    },
  }),
  emailNames: defineMessages({
    prison: {
      id: 'judicial.system.backend:notifications.email_names.prison',
      defaultMessage: 'Gæsluvarðhaldsfangelsi',
      description: 'Nafn á gæsluvarðhaldsfangelsi í tölvupóstum',
    },
    prisonAdmin: {
      id: 'judicial.system.backend:notifications.email_names.prison_admin',
      defaultMessage: 'Fangelsismálastofnun',
      description: 'Nafn á Fangelsismálastofnun í tölvupóstum',
    },
    courtOfAppeals: {
      id: 'judicial.system.backend:notifications.email_names.court_of_appeals',
      defaultMessage: 'Landsréttur',
      description: 'Nafn á Landsrétti í tölvupóstum',
    },
  }),
}
