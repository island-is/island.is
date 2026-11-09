// Strings on signed verdict overview screen
export const signedVerdictOverview = {
  caseDocuments: 'Skjöl málsins',
  unsignedDocument: 'Bíður undirritunar',
  signButton: 'Undirrita',
  sections: {
    courtRecordSignatureModal: {
      titleSigning: 'Rafræn undirritun',
      titleSuccess: 'Þingbók hefur verið undirrituð',
      titleCanceled: 'Notandi hætti við undirritun',
      titleFailure: 'Undirritun tókst ekki',
      completed: 'Undirrituð þingbók er aðgengileg undir "Skjöl málsins".',
      notCompleted: 'Vinsamlega reynið aftur.',
    },
    modifyDatesModal: {
      reasonForChangeTitle: 'Ástæða breytingar',
      reasonForChangeLabel: 'Ástæða breytingar',
      reasonForChangePlaceholder:
        'Bóka þarf ástæðu fyrir breytingu á skráðri lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæsluvarðhalds}}.',
      validToDateAndIsolationToDateAreTheSame:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} other {Gæsluvarðhald}} og einangrun til {date}',
      validToDateChanged:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} other {Gæsluvarðhald}} til {date}.',
      isolationDateChanged: 'Einangrun til {date}.',
      successText: '{modification} Tilkynning verður send aðilum máls.',
      travelBanSuccessText:
        'Farbann til {date}. Tilkynning verður send á ábyrgðaraðila málsins hjá {userRole, select, PROSECUTOR {héraðsdómstól} other {saksóknaraembætti}} og verjanda, hafi hann verið skráður.',
      modifiedValidToDateLabel:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbann} other {Gæsluvarðhald}} til',
      modifiedIsolationToDateLabel: 'Einangrun til',
    },
    modifyDatesInfo: {
      title:
        'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæslu}} uppfærð',
      explanation:
        '{date} kl. {time} - {userName} {userTitle}, {institutionName}<br/>Ástæða: {explanation}',
    },
    shareCase: {
      title: 'Opna mál fyrir öðru embætti',
      info: 'Hægt er að gefa öðru saksóknaraembætti aðgang að málinu. Viðkomandi embætti getur þá skoðað málið og farið fram á framlengingu. Hafi öryggisstig verið hækkað á meðan málið var í vinnslu verður það lækkað aftur við þessa breytingu, þ.a. allir sækjendur hjá báðum embættum munu geta séð málið.',
      label: 'Veldu embætti',
      placeholder: 'Velja embætti sem tekur við málinu',
      open: 'Opna mál',
      close: 'Loka aðgangi',
    },
    shareCaseModal: {
      openTitle: 'Mál {courtCaseNumber} hefur verið opnað fyrir öðru embætti',
      closeTitle:
        'Mál {courtCaseNumber} er nú lokað öðrum en upprunalegu embætti',
      openText:
        '_{prosecutorsOffice}_ hefur nú fengið aðgang að málinu. Allir sækjendur hjá því embætti og hjá þínu embætti geta séð málið.',
      closeText: '*{prosecutorsOffice}* hefur ekki lengur aðgang að málinu.',
    },
    caseExtension: {
      buttonLabel:
        'Framlengja {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} CUSTODY {gæslu} other {heimild}}',
      extensionInfo:
        '{hasChildCase, select, true {Framlengingarkrafa hefur þegar verið útbúin} other {Ekki er hægt að framlengja {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbann} CUSTODY {gæsluvarðhald} other {kröfu}} {rejectReason, select, rejected {sem var hafnað} dismissed {sem var vísað frá} isValidToDateInThePast {sem er lokið} acceptingAlternativeTravelBan {þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um} other {}}}}.',
    },
  },
}
