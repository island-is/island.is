export const notifications = {
  defender:
    '{sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {Talsmaður} other {Verjandi}} sakbornings{defenderName, select, NONE { hefur ekki verið skráður} other {: {defenderName}}}',
  courtRoom:
    '{courtRoom, select, NONE {Dómsalur hefur ekki verið skráður} other {Dómsalur: {courtRoom}}}.',
  judge:
    '{judgeName, select, NONE {Dómari hefur ekki verið skráður} other {Dómari: {judgeName}}}.',
  registrar: 'Dómritari: {registrarName}.',
  prosecutorText:
    'Sækjandi: {prosecutorName, select, NONE {Ekki skráður} other {{prosecutorName}}}{institutionName, select, NONE {} other { ({institutionName})}}.',
  smsTail: 'Sjá nánar á rettarvorslugatt.island.is.',
  emailTail:
    'Hægt er að nálgast yfirlitssíðu málsins í {linkStart}Réttarvörslugátt{linkEnd}.',
  emailWhitelist: '',
  emailWhitelistDomains: 'omnitrix.is,kolibri.is,dummy.dd',
  readyForCourt: {
    subject:
      '{isIndictmentCase, select, true {Ákæra} other {Krafa um {caseType}}} send',
    investigationCaseReadyForCourtSubject:
      'Krafa um rannsóknarheimild send ({caseType})',
    prosecutorHtml:
      'Þú hefur sent {isIndictmentCase, select, true {ákæru} other {kröfu}} á {courtName} vegna LÖKE {policeCaseNumbersCount, plural, zero {máls} one {máls {policeCaseNumbers}} other {mála: {policeCaseNumbers}}}. Skjalið er aðgengilegt undir {linkStart}málinu í Réttarvörslugátt{linkEnd}.',
  },
  courtRevoked: {
    caseTypeRevoked:
      '{caseType, select, TRAVEL_BAN {Farbannskrafa} ADMISSION_TO_FACILITY {Krafa um vistun á viðeigandi stofnun} other {Gæsluvarðhaldskrafa}} afturkölluð.',
    investigationCaseRevoked: 'Rannsóknarheimild afturkölluð.',
    courtDate: 'Fyrirtökutími: {date}, kl. {time}.',
    requestedCourtDate: 'ÓVE fyrirtöku {date}, eftir kl. {time}.',
  },
  courtHeadsUp: {
    arrestDateText: 'Viðkomandi handtekinn {date}, kl. {time}.',
    requestedCourtDateText: 'ÓE fyrirtöku {date}, eftir kl. {time}.',
    newCaseText:
      'Ný {caseType, select, TRAVEL_BAN {farbannskrafa} ADMISSION_TO_FACILITY {krafa um vistun á viðeigandi stofnun} CUSTODY {gæsluvarðhaldskrafa} OTHER {krafa um rannsóknarheimild} other {krafa um rannsóknarheimild ({courtTypeName})}} í vinnslu.',
  },
  defenderReadyForCourt: {
    subject: 'Krafa í máli {policeCaseNumber}',
    body: 'Sækjandi hefur valið að deila kröfu með þér {defenderResponsibility, select, null {} other {sem {defenderResponsibility}}} í máli {policeCaseNumber}.',
    link: '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast málið hjá {courtName}} other {Þú getur nálgast málið á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
  },
  indictmentCourtReadyForCourt: {
    subject: 'Ákæra tilbúin til afgreiðslu',
    body: '{prosecutorName} hefur sent inn nýja ákæru. Ákæran varðar eftirfarandi brot: {indictmentSubtypes}. Ákæran og öll skjöl málsins eru {linkStart}aðgengileg í Réttarvörslugátt.{linkEnd}',
  },
  courtReadyForCourt: {
    submittedCase:
      '{caseType, select, TRAVEL_BAN {Farbannskrafa} ADMISSION_TO_FACILITY {Krafa um vistun á viðeigandi stofnun} CUSTODY {Gæsluvarðhaldskrafa} OTHER {Krafa um rannsóknarheimild} other {Krafa um rannsóknarheimild ({courtTypeName})}} tilbúin til afgreiðslu.',
  },
  courtResubmittedToCourt:
    'Sækjandi í máli {courtCaseNumber} hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði.',
  defenderResubmittedToCourt: {
    subject: 'Krafa í máli {courtCaseNumber}',
    body: 'Sækjandi í máli {courtCaseNumber} hjá {courtName} hefur endursent kröfuna á dóminn.',
    link: '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
  },
  prosecutorReceivedByCourt:
    '{court} hefur móttekið {caseType, select, otherInvestigationCase {kröfu um rannsóknarheimild} investigationCase {kröfu um rannsóknarheimild ({caseTypeName})} restrictionCase {kröfu um {caseTypeName}} other {ákæru}} sem þú sendir og úthlutað málsnúmerinu {courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is.',
  postponedCourtDateEmail: {
    subject: 'Nýtt þinghald í máli {courtCaseNumber}',
    body: '{courtName} boðar til þinghalds í máli {courtCaseNumber}.<br />Fyrirtaka mun fara fram {courtDate}.<br /><br />Tegund þinghalds: {courtSessionTypeName}.<br /><br />{courtRoomText}<br /><br />{judgeText}<br /><br />{hasAccessToRvg, select, false {Hægt er að nálgast gögn málsins hjá {courtName}} other {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
  },
  prosecutorCourtDateEmail: {
    scheduledCase:
      '{court} hefur staðfest fyrirtökutíma fyrir kröfu um {investigationPrefix, select, onlyPrefix {rannsóknarheimild} withPrefix {rannsóknarheimild ({courtTypeName})} other {{courtTypeName}}}.',
    courtDate:
      'Fyrirtaka mun fara fram {courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}.',
    subject: 'Fyrirtaka í máli: {courtCaseNumber}',
    body: '{sessionArrangements, select, NONE_PRESENT {Krafan verður tekin fyrir án boðunar í þinghald.<br /><br />} other {}}{scheduledCaseText}<br /><br />{courtDateText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}{sessionArrangements, select, PROSECUTOR_PRESENT {} NONE_PRESENT {} other {<br /><br />{defenderText}.}}',
  },
  indictmentArraignmentDateEmail: {
    scheduledCase: '{court} boðar til þingfestingar í máli {courtCaseNumber}.',
    arraignmentDate: 'Þingfesting mun fara fram {arraignmentDate}.',
    subject: 'Þingfesting í máli: {courtCaseNumber}',
    body: '{scheduledCaseText}<br /><br />{arraignmentDateText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}',
  },
  signedRuling: {
    subject:
      'Úrskurður í máli {courtCaseNumber}{isModifyingRuling, select, true { leiðréttur} other {}}',
    prosecutorBodyS3:
      'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    defenderBody:
      'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}. <br />Hægt er að kæra úrskurðinn og senda greinargerðir og gögn í gegnum Réttarvörslugátt ef við á.',
    victimLawyerBody:
      'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
    prisonAdminBody:
      'Dómari hefur {isModifyingRuling, select, true {leiðrétt} other {undirritað og staðfest}} úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
  },
  acceptedWithoutRuling: {
    subject: 'Niðurstaða í máli {courtCaseNumber}',
    prosecutorBody:
      'Dómari hefur staðfest niðurstöðu í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    defenderBody:
      'Dómari hefur staðfest niðurstöðu í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
    victimLawyerBody:
      'Dómari hefur staðfest niðurstöðu í máli {courtCaseNumber} hjá {courtName}.<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
  },
  caseCompleted: {
    subject:
      '{isCorrection, select, true {Mál leiðrétt} other {Máli lokið}} {courtCaseNumber}',
    prosecutorBody:
      '{isCorrection, select, true {Mál {courtCaseNumber} hjá {courtName} hefur verið leiðrétt.} other {Máli {courtCaseNumber} hjá {courtName} hefur verið lokið.<br /><br />Niðurstaða: {caseIndictmentRulingDecision}}}<br /><br />Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.{isDismissal, select, true {<br /><br />Hægt er að kæra úrskurðinn og senda greinargerðir og gögn í gegnum Réttarvörslugátt ef við á.} other {}}',
    defenderBody:
      '{isCorrection, select, true {Mál {courtCaseNumber} hjá {courtName} hefur verið leiðrétt.} other {Máli {courtCaseNumber} hjá {courtName} hefur verið lokið.<br /><br />Niðurstaða: {caseIndictmentRulingDecision}}}<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.{isDismissal, select, true {<br /><br />Hægt er að kæra úrskurðinn og senda greinargerðir og gögn í gegnum Réttarvörslugátt ef við á.} other {}}',
  },
  prisonCourtDateEmail: {
    isolationTextV2:
      '{isolation, select, false {Ekki er farið fram á einangrun} other {Farið er fram á einangrun}}.',
    courtDateText:
      '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
    requestText:
      'Kyn sakbornings: {gender, select, MALE {Karl} FEMALE {Kona} other {Kynsegin/Annað}}.<br /><br />Krafist er {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}} til {requestedValidToDateText}.',
    courtText: '{court, select, NONE {ótilgreinds dómstóls} other {{court}}}',
    requestedValidToDateText:
      '{requestedValidToDate, select, NONE {ótilgreinds tíma} other {{requestedValidToDate}}}',
    body: '{prosecutorOffice, select, NONE {Ótilgreindur sækjandi} other {{prosecutorOffice}}} hefur sent kröfu um {isExtension, select, true {áframhaldandi } other {}}{caseType, select, ADMISSION_TO_FACILITY {vistunar á viðeignadi stofnun} other {gæsluvarðhald}} til {courtText} og verður málið tekið fyrir {courtDateText}.<br /><br />{requestText}<br /><br />{isolationText}<br /><br />{defenderText}.<br /><br />Málsnúmer héraðsdóms er {courtCaseNumber}.',
    subject:
      'Krafa {courtCaseNumber} um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeignadi stofnun} other {gæsluvarðhald}} í vinnslu',
  },
  prisonRulingEmail: {
    subject:
      '{isModifyingRuling, select, true {Úrskurður leiðréttur} other {Úrskurður}} í máli {courtCaseNumber}',
    body: '{institutionName} hefur úrskurðað aðila í {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}}{isModifyingRuling, select, true {} other { í þinghaldi sem lauk rétt í þessu}}. Hægt er að nálgast þingbók og vistunarseðil á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    paroleRevocationBody:
      '{institutionName} hefur rofið reynslulausn aðila með úrskurði í máli {courtCaseNumber}. Hægt er að nálgast þingbók á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
  },
  prisonRevokedEmail: {
    subject:
      'Krafa {courtCaseNumber} um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeignadi stofnun} other {gæsluvarðhald}} afturkölluð',
    revokedCase:
      '{prosecutorOffice, select, NONE {Ótilgreindur sækjandi} other {{prosecutorOffice}}} hefur afturkallað kröfu um {isExtension, select, true {áframhaldandi } other {}}{caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhald}} sem send var til {courtText} og taka átti fyrir {courtDateText}.',
    court: '{court, select, NONE {ótilgreinds dómstóls} other {{court}}}',
    courtDate:
      '{courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}',
    body: '{revokedCaseText}<br /><br />{defenderText}<br /><br />Málsnúmer héraðsdóms er {courtCaseNumber}.',
    defender:
      'Verjandi sakbornings{defenderName, select, NONE { hefur ekki verið skráður} other {: {defenderName}}}.',
  },
  rejectedCustodyEmail: {
    subject:
      '{isModifyingRuling, select, true {Úrskurður leiðréttur í máli {courtCaseNumber}} other {Kröfu {courtCaseNumber} um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}} hafnað}}',
    body: '{court} hefur hafnað kröfu um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhald}} með málsnúmerið {courtCaseNumber}.',
  },
  defenderCourtDateEmail: {
    sessionArrangements:
      '{court} hefur boðað þig í fyrirtöku {defenderResponsibility, select, null {} other {sem {defenderResponsibility}}}.',
    courtDate:
      'Fyrirtaka mun fara fram {courtDate, select, NONE {á ótilgreindum tíma} other {{courtDate}}}.',
    courtCaseNumber: 'Málsnúmer: {courtCaseNumber}.',
    prosecutor: 'Sækjandi: {prosecutorName} ({prosecutorInstitution}).',
    body: '{sessionArrangementsText}<br /><br />{courtDateText}<br /><br />{courtCaseNumberText}<br /><br />{courtRoomText}<br /><br />{judgeText}{registrarText, select, NONE {} other {<br /><br />{registrarText}}}<br /><br />{prosecutorText}',
    linkBody:
      'Sækjandi hefur valið að deila kröfu með þér {defenderResponsibility, select, null {} other {sem {defenderResponsibility}}} í máli {courtCaseNumber}.',
    link: '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent} other {Þú getur nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
    linkNoRequestBody:
      '{courtName} hefur skráð þig {defenderResponsibility, select, null {} other {sem {defenderResponsibility}}} í máli {courtCaseNumber}.',
    linkNoRequest:
      '<br /><br />{defenderHasAccessToRvg, select, false {Þú getur nálgast yfirlit málsins hjá {courtName} ef það hefur ekki þegar verið afhent} other {Þú getur nálgast yfirlit málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
  },
  defenderRevokedEmail: {
    subject:
      'Krafa um {caseType, select, CUSTODY {gæsluvarðhald} TRAVEL_BAN {farbann} ADMISSION_TO_FACILITY {vistun} other {rannsóknarheimild}} afturkölluð',
    bodyV2:
      '{actorInstitution} hefur afturkallað {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} CUSTODY {gæsluvarðhald} other {ákæru}} í máli {courtCaseNumber}.<br /><br />{defenderHasAccessToRvg, select, true {Hægt er að nálgast yfirlitssíðu málsins á {linkStart}rettarvorslugatt.island.is{linkEnd}} other {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent}}.',
    indictmentSubject: 'Ákæra afturkölluð í máli {courtCaseNumber}',
  },
  modified: {
    subject:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistunarmál} TRAVEL_BAN {Farbann} other {Gæsluvarðhaldsmál}} {courtCaseNumber}',
    html: '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæsluvarðhalds}} í máli {courtCaseNumber}. Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.<br /><br />Ný lokadagsetning: {validToDate}.',
    htmlDefender:
      '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæsluvarðhalds}} í máli {courtCaseNumber}.<br /><br />{defenderHasAccessToRvg, select, true {Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent}}.<br /><br />Ný lokadagsetning: {validToDate}.',
    isolationHtml:
      '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd gæsluvarðhalds/einangrunar í máli {courtCaseNumber}. Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.<br /><br />Lok gæsluvarðhalds: {validToDate}.<br /><br />Lok einangrunar: {isolationToDate}.',
    isolationHtmlDefender:
      '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd gæsluvarðhalds/einangrunar í máli {courtCaseNumber}. {defenderHasAccessToRvg, select, true {Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Þú getur nálgast gögn málsins hjá {courtName} ef þau hafa ekki þegar verið afhent}}.<br /><br />Lok gæsluvarðhalds: {validToDate}.<br /><br />Lok einangrunar: {isolationToDate}.',
  },
  defendantsNotUpdatedAtCourt: {
    subject: 'Skráning varnaraðila/verjenda í máli {courtCaseNumber}',
    body: 'Ekki tókst að skrá varnaraðila/verjendur í máli {courtCaseNumber} í Auði. Yfirfara þarf málið í Auði og skrá rétta aðila áður en því er lokað.',
  },
  emailNames: {
    prison: 'Gæsluvarðhaldsfangelsi',
    prisonAdmin: 'Fangelsismálastofnun',
    courtOfAppeals: 'Landsréttur',
    publicProsecutorCriminalRecords: 'Ritari sakaskrár',
  },
  COAJudgeAssigned: {
    subject: 'Úthlutun máls nr. {caseNumber}',
    forepersonBody:
      'Landsréttur hefur skráð þig sem dómsformann í máli nr. {caseNumber}. Þú getur nálgast yfirlit málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt.{linkEnd}',
    body: 'Landsréttur hefur skráð þig sem {role, select, COURT_OF_APPEALS_JUDGE {dómara} other {aðstoðarmann dómara}} í máli nr. {caseNumber}. Dómsformaður er {foreperson}. Þú getur nálgast yfirlit málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt.{linkEnd}',
  },
  indictmentDenied: {
    subject: 'Ákæru hafnað',
    body: 'Ákæru vegna lögreglumáls númer {caseNumber} hefur verið hafnað. Þú getur nálgast samantekt málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt.{linkEnd}',
  },
  courtRevokedIndictmentEmail: {
    subject:
      'Ákæra afturkölluð{courtCaseNumber, select, NONE {} other { í máli {courtCaseNumber}}}',
    body: '{prosecutorsOffice} hefur afturkallað ákæru í máli {caseNumber}.',
  },
  caseFilesUpdated: {
    subject: 'Ný gögn í máli {courtCaseNumber}',
    body: 'Ný gögn hafa borist vegna máls {courtCaseNumber}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
  },
  courtOfficialAssignedEmail: {
    subject: 'Úthlutun máls {courtCaseNumber}',
    body: 'Héraðsdómur hefur skráð þig sem {role, select, DISTRICT_COURT_JUDGE {dómara} DISTRICT_COURT_REGISTRAR {dómritara} other {óþekkt}} í máli {courtCaseNumber}. Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}',
  },
}
