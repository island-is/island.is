import { defineMessage, defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const signedVerdictOverview = {
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
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.title_signing',
        defaultMessage: 'Rafræn undirritun',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi á meðan á undirritun stendur á yfirlitsskjá afgreiddra mála.',
      },
      titleSuccess: {
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.title_success',
        defaultMessage: 'Þingbók hefur verið undirrituð',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi að undirritun lokinni á yfirlitsskjá afgreiddra mála.',
      },
      titleCanceled: {
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.title_canceled',
        defaultMessage: 'Notandi hætti við undirritun',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi eftir að notandi hættir við á yfirlitsskjá afgreiddra mála.',
      },
      titleFailure: {
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.title_failure',
        defaultMessage: 'Undirritun tókst ekki',
        description:
          'Notaður sem titill í "undirritun þingbókar" skrefi eftir misheppnaða undirritun á yfirlitsskjá afgreiddra mála.',
      },
      controlCode: {
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.control_code',
        defaultMessage: 'Öryggistala: {controlCode}',
        description:
          'Notaður sem texti í "undirritun þingbókar" skrefi á meðan á undirritun stendur á yfirlitsskjá afgreiddra mála.',
      },
      controlCodeDisclaimer: {
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.control_code_disclaimer',
        defaultMessage:
          'Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama öryggistala birtist í símanum þínum.',
        description:
          'Notaður sem vivörunartexti í "undirritun þingbókar" skrefi á meðan á undirritun stendur á yfirlitsskjá afgreiddra mála.',
      },
      completed: {
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.completed',
        defaultMessage:
          'Undirrituð þingbók er aðgengileg undir "Skjöl málsins".',
        description:
          'Notaður sem texti í "undirritun þingbókar" skrefi að undirritun lokinni á yfirlitsskjá afgreiddra mála.',
      },
      notCompleted: {
        id: 'judicial.system.core:signed_verdict_overview.court_record_signature.not_completed',
        defaultMessage: 'Vinsamlega reynið aftur.',
        description:
          'Notaður sem texti í "undirritun þingbókar" skrefi ef undirritun var ekki lokið á yfirlitsskjá afgreiddra mála.',
      },
    }),
    modifyDatesModal: defineMessages({
      reasonForChangeTitle: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.reason_for_change_title',
        defaultMessage: 'Ástæða breytingar',
        description:
          'Notaður sem titill fyrir "Ástæða breytingar" hlutann í "Breyting á lengd gæsluvarðhalds/vistunar" glugga.',
      },
      reasonForChangeLabel: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.reason_for_change_label',
        defaultMessage: 'Ástæða breytingar',
        description:
          'Notaður sem titill í "Ástæða breytingar" textaboxi í "Breyting á lengd gæsluvarðhalds/vistunar" glugga.',
      },
      reasonForChangePlaceholder: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.reason_for_change_placeholder_v3',
        defaultMessage:
          'Bóka þarf ástæðu fyrir breytingu á skráðri lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæsluvarðhalds}}.',
        description:
          'Notaður sem skýritexti í "Ástæða breytingar" textaboxi í "Breyting á lengd gæsluvarðhalds/vistunar" glugga.',
      },
      validToDateAndIsolationToDateAreTheSame: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.valid_to_date_and_isolation_to_date_are_the_same',
        defaultMessage:
          '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} other {Gælsuvarðhald}} og einangrun til {date}',
        description:
          'Notaður sem texti í "Lengd gæsluvarðhalds breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      validToDateChanged: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.valid_to_date_changed',
        defaultMessage:
          '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} other {Gælsuvarðhald}} til {date}.',
        description:
          'Notaður sem texti "Lengd gæsluvarðhalds breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      isolationDateChanged: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.isolation_date_changed',
        defaultMessage: 'Einangrun til {date}.',
        description:
          'Notaður sem texti "Lengd gæsluvarðhalds breytt/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      successText: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.success_text_v1',
        defaultMessage: '{modification}\nTilkynning verður send aðilum máls.',
        description:
          'Notaður sem texti í "Lengd gæsluvarðhalds/vistunar breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      travelBanSuccessText: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.travel_ban_success_text',
        defaultMessage:
          'Farbann til {date}. Tilkynning verður send á ábyrgðaraðila málsins hjá {userRole, select, PROSECUTOR {héraðsdómstól} other {saksóknaraembætti}}.',
        description:
          'Notaður sem texti í "Lengd farbanns breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      modifiedValidToDateLabel: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.modified_valid_to_date_label_v3',
        defaultMessage:
          '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbann} other {Gæsluvarðhald}} til',
        description:
          'Notaður sem texti í  "Breyting á lengd gæsluvarðhalds/vistunar" glugga á yfirlitsskjá afgreiddra mála.',
      },
      modifiedIsolationToDateLabel: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_modal.modified_isolation_to_date_label',
        defaultMessage: 'Einangrun til',
        description:
          'Notaður sem texti í "Einangrun til" í  "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
    }),
    confirmAppealAfterDeadlineModal: defineMessages({
      title: {
        id: 'judicial.system.core:signed_verdict_overview.confirm_appeal_after_deadline_modal.title',
        defaultMessage: 'Kærufrestur er liðinn',
        description:
          'Notaður sem titill modal glugga þegar kært er eftir að kærufrestur rennur út.',
      },
      text: {
        id: 'judicial.system.core:signed_verdict_overview.confirm_appeal_after_deadline_modal.text',
        defaultMessage: 'Viltu halda áfram og senda kæru?',
        description:
          'Notaður sem texti í modal glugga þegar kært er eftir að kærufrestur rennur út.',
      },
      primaryButtonText: {
        id: 'judicial.system.core:signed_verdict_overview.confirm_appeal_after_deadline_modal.primary_button_text',
        defaultMessage: 'Já, senda kæru',
        description:
          'Notaður sem texti í staðfesta takka í modal glugga þegar kært er eftir að kærufrestur rennur út.',
      },
      secondaryButtonText: {
        id: 'judicial.system.core:signed_verdict_overview.confirm_appeal_after_deadline_modal.secondary_button_text',
        defaultMessage: 'Hætta við',
        description:
          'Notaður sem texti í Hætta við takka í modal glugga þegar kært er eftir að kærufrestur rennur út.',
      },
    }),
    appealReceived: defineMessages({
      title: {
        id: 'judicial.system.core:signed_verdict_overview.appeal_received.title',
        defaultMessage: 'Tilkynningar sendar á málsaðila',
        description:
          'Notaður sem titill í upplýsingaboxi sem birtist þegar að héraðsdómur hefur móttekið kæru.',
      },
      text: {
        id: 'judicial.system.core:signed_verdict_overview.appeal_received.text',
        defaultMessage:
          'Tilkynning um móttöku kæru hefur verið send Landsrétti, sækjanda og verjanda.',
        description:
          'Notaður sem texti í upplýsingaboxi sem birtist þegar að héraðsdómur hefur móttekið kæru.',
      },
      primaryButtonText: {
        id: 'judicial.system.core:signed_verdict_overview.appeal_received.primary_button_text',
        defaultMessage: 'Loka glugga',
        description:
          'Notaður sem texti á takka sem lokar upplýsingaboxi eftir að héraðsdómur hefur móttekið kæru.',
      },
    }),
    modifyDatesInfo: defineMessages({
      title: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_info.title_V3',
        defaultMessage:
          'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæslu}} uppfærð',
        description:
          'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá afgreiddra mála.',
      },
      explanation: {
        id: 'judicial.system.core:signed_verdict_overview.modify_dates_info.explanantion',
        defaultMessage:
          '{date} kl. {time} - {userName} {userTitle}, {institutionName}<br/>Ástæða: {explanation}',
        description:
          'Notaður sem beinagrind af texta í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá afgreiddra mála..',
      },
    }),
    modifyRulingInfo: defineMessages({
      title: {
        id: 'judicial.system.core:signed_verdict_overview.modify_ruling_info.title',
        defaultMessage: 'Úrskurður leiðréttur',
        description:
          'Notaður sem titill í upplýsingaboxi um að úrskurður hafi verið leiðréttur á yfirlitsskjá afgreiddra mála.',
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
        id: 'judicial.system.core:signed_verdict_overview.share_case.placeholder',
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
        id: 'judicial.system.core:signed_verdict_overview.share_case_modal.open_title',
        defaultMessage:
          'Mál {courtCaseNumber} hefur verið opnað fyrir öðru embætti',
        description:
          'Notaður sem titill í modal glugga þegar mál hefur verið opnað fyrir öðru embætti',
      },
      closeTitle: {
        id: 'judicial.system.core:signed_verdict_overview.share_case_modal.close_title',
        defaultMessage:
          'Mál {courtCaseNumber} er nú lokað öðrum en upprunalegu embætti',
        description:
          'Notaður sem titill í modal glugga þegar máli hefur verið lokað fyrir öðru embætti',
      },
      openText: {
        id: 'judicial.system.core:signed_verdict_overview.share_case_modal.open_text#markdown',
        defaultMessage:
          '**{prosecutorsOffice}** hefur nú fengið aðgang að málinu. Hafi málið verið með hækkuðu öryggisstigi hefur nú verið slökkt á því.',
        description:
          'Notaður sem texti í modal glugga þegar mál hefur verið opnað fyrir öðru embætti',
      },
      closeText: {
        id: 'judicial.system.core:signed_verdict_overview.share_case_modal.close_text#markdown',
        defaultMessage:
          '**{prosecutorsOffice}** hefur ekki lengur aðgang að málinu.',
        description:
          'Notaður sem texti í modal glugga þegar máli hefur verið lokað fyrir öðru embætti',
      },
    }),
    caseExtension: defineMessages({
      buttonLabel: {
        id: 'judicial.system.core:signed_verdict_overview.case_extension.button_label',
        defaultMessage:
          'Framlengja {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} CUSTODY {gæslu} other {heimild}}',
        description: 'Notaður sem label á framlengja mál takka',
      },
      extensionInfo: {
        id: 'judicial.system.core:signed_verdict_overview.case_extension.button_v2',
        defaultMessage:
          '{hasChildCase, select, true {Framlengingarkrafa hefur þegar verið útbúin} other {Ekki hægt að framlengja {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbann} CUSTODY {gæsluvarðhald} other {kröfu}} {rejectReason, select, rejected {sem var hafnað} dismissed {sem var vísað frá} isValidToDateInThePast {sem er lokið} acceptingAlternativeTravelBan {þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um} other {}}}}.',
        description:
          'Notaður sem upplýsingatexti á info búbblu hjá framlengja mál takka',
      },
    }),
  },
}
