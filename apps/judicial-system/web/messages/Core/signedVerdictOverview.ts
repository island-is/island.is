import { defineMessage, defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const signedVerdictOverview = {
  rulingDateLabel: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.ruling_date_label',
    defaultMessage: 'Úrskurðað {courtEndTime}',
    description: 'Notaður sem label fyrir hvenær úrskurðurinn var.',
  }),
  dismissedTitle: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.dismissed_title',
    defaultMessage: 'Kröfu vísað frá',
    description:
      'Notaður sem titill á yfirlitsskjá afgreiddra mála þegar máli er vísað frá.',
  }),
  validToDateInThePast: defineMessage({
    id:
      'judicial.system.core:signed_verdict_overview.valid_to_date_in_the_past',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbanni} other {Gæsluvarðhaldi}} lokið',
    description:
      'Notaður sem titil á yfirlitsskjá afreiddra mála þegar dagsetning gæslu/vistunar/farbanni er liðin.',
  }),
  restrictionActive: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.restriction_active',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun virk} TRAVEL_BAN {Farbann virkt} other {Gæsluvarðhald virkt}}',
    description:
      'Notaður sem titil á yfirlitsskjá afreiddra mála þegar dagsetning gæslu/vistunar/farbanni er liðin.',
  }),
  investigationAccepted: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.investigation_accepted',
    defaultMessage: 'Krafa um rannsóknarheimid samþykkt',
    description:
      'Notaður sem titil á yfirlitsskjá afreiddra mála krafa um rannsóknarheimid samþykkt.',
  }),
  conclusionTitle: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.conclusion_title',
    defaultMessage: 'Úrskurðarorð',
    description:
      'Notaður sem titill fyrir "Úrskurðarorð" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  }),
  caseDocuments: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.case_documents',
    defaultMessage: 'Skjöl málsins',
    description:
      'Notaður sem titill í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  }),
  unsignedDocument: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.unsigned_document',
    defaultMessage: 'Bíður undirritunar',
    description:
      'Notaður sem texti fyrir óundirritað í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  }),
  signButton: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.sign_button',
    defaultMessage: 'Undirrita',
    description:
      'Notaður sem texti fyrir undirritunarhnapp í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
  }),
  sections: {
    courtRecordSignatureModal: defineMessages({
      titleSigning: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.title_signing',
        defaultMessage: 'Rafræn undirritun',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi á meðan á undirritun stendur á yfirlitsskjá afgreiddra mála.',
      },
      titleSuccess: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.title_success',
        defaultMessage: 'Þingbók hefur verið undirrituð',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi að undirritun lokinni á yfirlitsskjá afgreiddra mála.',
      },
      titleCanceled: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.title_canceled',
        defaultMessage: 'Notandi hætti við undirritun',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi eftir að notandi hættir við á yfirlitsskjá afgreiddra mála.',
      },
      titleFailure: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.title_failure',
        defaultMessage: 'Undirritun tókst ekki',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi eftir misheppnaða undirritun á yfirlitsskjá afgreiddra mála.',
      },
      controlCode: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.control_code',
        defaultMessage: 'Öryggistala: {controlCode}',
        description:
          'Notaður sem texti í "undirritun þingbókar" skrefi á meðan á undirritun stendur á yfirlitsskjá afgreiddra mála.',
      },
      controlCodeDisclaimer: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.control_code_disclaimer',
        defaultMessage:
          'Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama öryggistala birtist í símanum þínum.',
        description:
          'Notaður sem vivörunartexti í "undirritun þingbókar" skrefi á meðan á undirritun stendur á yfirlitsskjá afgreiddra mála.',
      },
      completed: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.completed',
        defaultMessage:
          'Undirrituð þingbók er aðgengileg undir "Skjöl málsins".',
        description:
          'Notaður sem texti í "undirritun þingbókar" skrefi að undirritun lokinni á yfirlitsskjá afgreiddra mála.',
      },
      notCompleted: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.not_completed',
        defaultMessage: 'Vinsamlega reynið aftur.',
        description:
          'Notaður sem texti í "undirritun þingbókar" skrefi ef undirritun var ekki lokið á yfirlitsskjá afgreiddra mála.',
      },
      closeButon: {
        id:
          'judicial.system.core:signed_verdict_overview.court_record_signature.close_button',
        defaultMessage: 'Loka glugga',
        description:
          'Notaður sem texti fyrir "loka hnappi" í "undirritun þingbókar" skrefi á yfirlitsskjá afgreiddra mála.',
      },
    }),
    // TODO: remove strings that are not used
    modifyDatesModal: defineMessages({
      title: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.title',
        defaultMessage: 'Breyting á lengd gæsluvarðhalds',
        description:
          'Notaður sem titill í "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      titleV2: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.title_v2',
        defaultMessage:
          'Breyting á lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}}',
        description:
          'Notaður sem titill í "Breyting á lengd gæsluvarðhalds/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      successTitle: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.success_title',
        defaultMessage: 'Lengd gæsluvarðhalds breytt',
        description:
          'Notaður sem titill í "Lengd gæsluvarðhalds breytt" glugga á yfirlitsskjá afgreiddra mála þegar breyting á lengd gæsluvarðhalds hefur verið geymd.',
      },
      successTitleV2: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.success_title_v2',
        defaultMessage:
          'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}} breytt',
        description:
          'Notaður sem titill í "Lengd gæsluvarðhalds/vistunar breytt" glugga á yfirlitsskjá afgreiddra mála þegar breyting á lengd gæsluvarðhalds/vistunar hefur verið geymd.',
      },
      reasonForChangeTitle: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.reason_for_change_title',
        defaultMessage: 'Ástæða breytingar',
        description:
          'Notaður sem titill fyrir "Ástæða breytingar" hlutann í "Breyting á lengd gæsluvarðhalds/vistunar" glugga.',
      },
      reasonForChangeLabel: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.reason_for_change_label',
        defaultMessage: 'Ástæða breytingar',
        description:
          'Notaður sem titill í "Ástæða breytingar" textaboxi í "Breyting á lengd gæsluvarðhalds/vistunar" glugga.',
      },
      reasonForChangePlaceholder: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.reason_for_change_placeholder',
        defaultMessage:
          'Bóka þarf ástæðu fyrir breytingu á skráðri lengd gæsluvarðhalds.',
        description:
          'Notaður sem skýritexti í "Ástæða breytingar" textaboxi í "Breyting á lengd gæsluvarðhalds" glugga.',
      },
      reasonForChangePlaceholderV2: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.reason_for_change_placeholder_v2',
        defaultMessage:
          'Bóka þarf ástæðu fyrir breytingu á skráðri lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}}.',
        description:
          'Notaður sem skýritexti í "Ástæða breytingar" textaboxi í "Breyting á lengd gæsluvarðhalds/vistunar" glugga.',
      },
      text: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.text',
        defaultMessage:
          'Hafi gæsluvarðhaldi eða einangrun verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd gæsluvarðhalds. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.',
        description:
          'Notaður sem texti í "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      textV2: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.text_v2',
        defaultMessage:
          'Hafi {caseType, select, ADMISSION_TO_FACILITY {vistun} other {gæsluvarðhaldi}} eða einangrun verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæsluvarðhalds}}. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.',
        description:
          'Notaður sem texti í "Breyting á lengd gæsluvarðhalds/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      validToDateAndIsolationToDateAreTheSame: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.valid_to_date_and_isolation_to_date_are_the_same',
        defaultMessage:
          '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} other {Gælsuvarðhald}} og einangrun til {date}',
        description:
          'Notaður sem texti í "Lengd gæsluvarðhalds breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      validToDateChanged: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.valid_to_date_changed',
        defaultMessage:
          '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} other {Gælsuvarðhald}} til {date}.',
        description:
          'Notaður sem texti "Lengd gæsluvarðhalds breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      isolationDateChanged: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.isolation_date_changed',
        defaultMessage: 'Einangrun til {date}.',
        description:
          'Notaður sem texti "Lengd gæsluvarðhalds breytt/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      successText: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.success_text',
        defaultMessage:
          '{modification}\nTilkynning verður send á ábyrgðaraðila málsins hjá {courtOrProsecutor}. Ef gæsluvarðhaldsfangelsi hefur ekki verið upplýst og þörf er á því, þarf að gera það eftir hefðbundinni boðleið.',
        description:
          'Notaður sem texti í "Lengd gæsluvarðhalds/vistunar breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      primaryButtonText: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.primary_button_text',
        defaultMessage: 'Staðfesta',
        description:
          'Notaður sem texti í staðfesta takka í "Breyta lengd gæsluvarðhalds/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      secondaryButtonText: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.secondary_button_text',
        defaultMessage: 'Hætta við',
        description:
          'Notaður sem texti í hætta við takka í "Breyta lengd gæsluvarðhalds/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      secondaryButtonTextSuccess: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.secondary_button_text_success',
        defaultMessage: 'Loka glugga',
        description:
          'Notaður sem texti í loka takka í "Lengd gæsluvarðhalds/vistunar breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      modifiedValidToDateLabel: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.modified_valid_to_date_label',
        defaultMessage: 'Gæsluvarðhald til',
        description:
          'Notaður sem texti í "Gæsluvarðhald til" í  "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      modifiedValidToDateLabelV2: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.modified_valid_to_date_label_v2',
        defaultMessage:
          '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} other {Gæsluvarðhald}} til',
        description:
          'Notaður sem texti í  "Breyting á lengd gæsluvarðhalds/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      modifiedIsolationToDateLabel: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_modal.modified_isolation_to_date_label',
        defaultMessage: 'Einangrun til',
        description:
          'Notaður sem texti í "Einangrun til" í  "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
    }),
    modifyDatesInfo: defineMessages({
      title: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_info.title',
        defaultMessage: 'Lengd gæslu uppfærð',
        description:
          'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá afgreiddra mála.',
      },
      titleV2: {
        id:
          'judicial.system.core:signed_verdict_overview.modify_dates_info.title_V2',
        defaultMessage:
          'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}} uppfærð',
        description:
          'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá afgreiddra mála.',
      },
    }),
    shareCase: defineMessages({
      title: {
        id: 'judicial.system.core:signed_verdict_overview.share_case.title',
        defaultMessage: 'Opna mál fyrir öðru embætti',
        description: 'Notaður sem titill í "deila með öðru embætti" kafla',
      },
      info: {
        id: 'judicial.system.core:signed_verdict_overview.share_case.info',
        defaultMessage:
          'Hægt er að gefa öðru embætti aðgang að málinu. Viðkomandi embætti getur skoðað málið og farið fram á framlengingu. Sé málið opnað fyrir öðru embætti er slökkt á hækkuðu öryggisstigi.',
        description: 'Notaður sem upplýsingatexti í info búbblu',
      },
      label: {
        id: 'judicial.system.core:signed_verdict_overview.share_case.label',
        defaultMessage: 'Veldu embætti',
        description: 'Notaður sem label í embætti drop-down',
      },
      placeholder: {
        id:
          'judicial.system.core:signed_verdict_overview.share_case.placeholder',
        defaultMessage: 'Velja embætti sem tekur við málinu',
        description: 'Notaður sem placeholder í embætti drop-down',
      },
      open: {
        id: 'judicial.system.core:signed_verdict_overview.share_case.open',
        defaultMessage: 'Opna mál',
        description: 'Notaður sem label á opna takka',
      },
      close: {
        id: 'judicial.system.core:signed_verdict_overview.share_case.close',
        defaultMessage: 'Loka aðgangi',
        description: 'Notaður sem label á loka takka',
      },
    }),
    shareCaseModal: defineMessages({
      openTitle: {
        id:
          'judicial.system.core:signed_verdict_overview.share_case_modal.open_title',
        defaultMessage:
          'Mál {courtCaseNumber} hefur verið opnað fyrir öðru embætti',
        description:
          'Notaður sem titill í modal glugga þegar mál hefur verið opnað fyrir öðru embætti',
      },
      closeTitle: {
        id:
          'judicial.system.core:signed_verdict_overview.share_case_modal.close_title',
        defaultMessage:
          'Mál {courtCaseNumber} er nú lokað öðrum en upprunalegu embætti',
        description:
          'Notaður sem titill í modal glugga þegar máli hefur verið lokað fyrir öðru embætti',
      },
      openText: {
        id:
          'judicial.system.core:signed_verdict_overview.share_case_modal.open_text#markdown',
        defaultMessage:
          '**{prosecutorsOffice}** hefur nú fengið aðgang að málinu. Hafi málið verið með hækkuðu öryggisstigi hefur nú verið slökkt á því.',
        description:
          'Notaður sem texti í modal glugga þegar mál hefur verið opnað fyrir öðru embætti',
      },
      closeText: {
        id:
          'judicial.system.core:signed_verdict_overview.share_case_modal.close_text#markdown',
        defaultMessage:
          '**{prosecutorsOffice}** hefur ekki lengur aðgang að málinu.',
        description:
          'Notaður sem texti í modal glugga þegar máli hefur verið lokað fyrir öðru embætti',
      },
      buttonClose: {
        id:
          'judicial.system.core:signed_verdict_overview.share_case_modal.button_close',
        defaultMessage: 'Loka glugga',
        description: 'Notaður sem label á loka takka í modal glugga',
      },
    }),
    caseExtension: defineMessages({
      buttonLabel: {
        id:
          'judicial.system.core:signed_verdict_overview.case_extension.button_label',
        defaultMessage:
          'Framlengja {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} CUSTODY {gæslu} other {heimild}}',
        description: 'Notaður sem label á framlengja mál takka',
      },
      extensionInfo: {
        id:
          'judicial.system.core:signed_verdict_overview.case_extension.button',
        defaultMessage:
          '{hasChildCase, select, yes {Framlengingarkrafa hefur þegar verið útbúin} other {Ekki hægt að framlengja {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbann} CUSTODY {gæsluvarðhald} other {kröfu}} {rejectReason, select, rejected {sem var hafnað} dismissed {sem var vísað frá} isValidToDateInThePast {sem er lokið} acceptingAlternativeTravelBan {þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um} other {}}}}.',
        description:
          'Notaður sem upplýsingatexti á info búbblu hjá framlengja mál takka',
      },
    }),
    appeal: defineMessages({
      title: {
        id: 'judicial.system.core:signed_verdict_overview.appeal.title',
        defaultMessage: 'Ákvörðun um kæru',
        description:
          'Notaður sem titill í Ákvörðun um kæru hluta á yfirlitsskjá afgreiddra mála.',
      },
      deadline: {
        id: 'judicial.system.core:signed_verdict_overview.appeal.deadline',
        defaultMessage:
          'Kærufrestur {isAppealDeadlineExpired, select, true {rann} false {rennur}} út {appealDeadline}',
      },
      accusedAppealed: {
        id:
          'judicial.system.core:signed_verdict_overview.appeal.accused_appealed',
        defaultMessage:
          '{genderedAccused} hefur kært úrskurðinn í þinghaldi sem lauk {courtEndTime}',
        description:
          'Notaður sem upplýsingatexti sem útskýrir að kærði kærði úrskurðinn í þinghaldi á yfirlitsskjá afgreiddra mála.',
      },
      prosecutorAppealed: {
        id:
          'judicial.system.core:signed_verdict_overview.appeal.prosecutor_appealed',
        defaultMessage:
          'Sækjandi hefur kært úrskurðinn í þinghaldi sem lauk {courtEndTime}',
        description:
          'Notaður sem upplýsingatexti sem útskýrir að sækjandi kærði úrskurðinn í þinghaldi á yfirlitsskjá afgreiddra mála.',
      },
    }),
  },
}
