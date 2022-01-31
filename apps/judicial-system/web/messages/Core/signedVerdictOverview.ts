import { defineMessage, defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const signedVerdictOverview = {
  accusedAppealed: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.accused_appealed',
    defaultMessage:
      '{genderedAccused} hefur kært úrskurðinn í þinghaldi sem lauk {courtEndTime}',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að kærði kærði úrskurðinn í þinghaldi á yfirlitsskjá afgreiddra mála.',
  }),
  prosecutorAppealed: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.prosecutor_appealed',
    defaultMessage:
      'Sækjandi hefur kært úrskurðinn í þinghaldi sem lauk {courtEndTime}',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að sækjandi kærði úrskurðinn í þinghaldi á yfirlitsskjá afgreiddra mála.',
  }),
  allFilesUploadedToCourtText: defineMessage({
    id:
      'judicial.system.core:signed_verdict_overview.all_files_uploaded_to_court_text',
    defaultMessage: 'Gögn hafa verið vistuð í Auði',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að tekist hafi að vista öll gögn í Auði á yfirlitsskjá afgreiddra mála.',
  }),
  someFilesUploadedToCourtText: defineMessage({
    id:
      'judicial.system.core:signed_verdict_overview.some_files_uploaded_to_court_text',
    defaultMessage: 'Ekki tókst að vista öll gögn í Auði',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að ekki hafi tekist að vista öll gögn í Auði á yfirlitsskjá afgreiddra mála.',
  }),
  uploadToCourtButtonText: defineMessage({
    id:
      'judicial.system.core:signed_verdict_overview.upload_to_court_button_text',
    defaultMessage: 'Vista gögn í Auði',
    description:
      'Notaður sem texti í "Hlaða upp gögnum í Auði" takkanum á yfirlitsskjá afgreiddra mála.',
  }),
  retryUploadToCourtButtonText: defineMessage({
    id:
      'judicial.system.core:signed_verdict_overview.retry_upload_to_court_button_text',
    defaultMessage: 'Reyna aftur',
    description:
      'Notaður sem texti í "Hlaða upp gögnum í Auði" takkanum á yfirlitsskjá afgreiddra mála ef ekki tókst að hlaða upp öllum skjölunum.',
  }),
  uploadToCourtAllBrokenText: defineMessage({
    id:
      'judicial.system.core:signed_verdict_overview.upload_to_court_all_broken_text',
    defaultMessage:
      'Ofangreind rannsóknargögn eru ekki lengur aðgengileg í Réttarvörslugátt.',
    description:
      'Notaður sem upplýsingatexti sem útskýrir að rannsóknargögn eru ekki aðgengileg í Réttarvörslugátt.',
  }),
  dismissedTitle: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.dismissed_title',
    defaultMessage: 'Kröfu vísað frá',
    description:
      'Notaður sem titill á yfirlitsskjá afgreiddra mála þegar máli er vísað frá.',
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
  signedDocument: defineMessage({
    id: 'judicial.system.core:signed_verdict_overview.signed_document',
    defaultMessage: 'Undirritað - {date} kl. {time}',
    description:
      'Notaður sem texti fyrir undirritað í "Skjöl málsins" hlutanum á úrskurðar skrefi á yfirlitsskjá afgreiddra mála.',
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
    alterDatesModal: defineMessages({
      title: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.title',
        defaultMessage: 'Breyting á lengd gæsluvarðhalds',
        description:
          'Notaður sem titill í "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      successTitle: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.success_title',
        defaultMessage: 'Lengd gæsluvarðhalds breytt',
        description:
          'Notaður sem titill í "Lengd gæsluvarðhalds breytt" glugga á yfirlitsskjá afgreiddra mála þegar breyting á lengd gæsluvarðhalds hefur verið geymd.',
      },
      reasonForChangeTitle: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.reason_for_change_title',
        defaultMessage: 'Ástæða breytingar',
        description:
          'Notaður sem titill fyrir "Ástæða breytingar" hlutann í "Breyting á lengd gæsluvarðhalds" glugga.',
      },
      reasonForChangeLabel: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.reason_for_change_label',
        defaultMessage: 'Ástæða breytingar',
        description:
          'Notaður sem titill í "Ástæða breytingar" textaboxi í "Breyting á lengd gæsluvarðhalds" glugga.',
      },
      reasonForChangePlaceholder: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.reason_for_change_placeholder',
        defaultMessage:
          'Bóka þarf ástæðu fyrir breytingu á skráðri lengd gæsluvarðhalds.',
        description:
          'Notaður sem skýritexti í "Ástæða breytingar" textaboxi í "Breyting á lengd gæsluvarðhalds" glugga.',
      },
      text: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.text',
        defaultMessage:
          'Hafi gæsluvarðhaldi eða einangrun verið aflétt, kæra til Landsréttar leitt til breytingar eða leiðrétta þarf ranga skráningu, er hægt að uppfæra lengd gæsluvarðhalds. Sýnilegt verður hver gerði leiðréttinguna, hvenær og af hvaða ástæðu.',
        description:
          'Notaður sem texti í "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      successText: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.success_text',
        defaultMessage:
          'Gæsluvarðhald og einangrun til 10. desember 2021 kl 16:00. Tilkynning verður send á ábyrgðaraðila málsins hjá sækjanda. Ef gæsluvarðhaldsfangelsi hefur ekki verið upplýst og þörf er á því, þarf að gera það eftir hefðbundinni boðleið.',
        description:
          'Notaður sem texti í "Lengd gæsluvarðhalds breytt" glugga á yfirlitsskjá afgreiddra mála.',
      },
      primaryButtonText: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.primary_button_text',
        defaultMessage: 'Staðfesta',
        description:
          'Notaður sem texti í staðfesta takka í "Breyta lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      secondaryButtonText: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.secondary_button_text',
        defaultMessage: 'Hætta við',
        description:
          'Notaður sem texti í hætta við takka í "Breyta lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      alteredValidToDateLabel: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.altered_valid_to_date_label',
        defaultMessage: 'Gæsluvarðhald til',
        description:
          'Notaður sem texti í "Gæsluvarðhald til" í  "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
      alteredIsolationToDateLabel: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_modal.altered_isolation_to_date_label',
        defaultMessage: 'Einangrun til',
        description:
          'Notaður sem texti í "Einangrun til" í  "Breyting á lengd gæsluvarðhalds" glugga á yfirlitsskjá afgreiddra mála.',
      },
    }),
    alterDatesInfo: defineMessages({
      title: {
        id:
          'judicial.system.core:signed_verdict_overview.alter_dates_info.title',
        defaultMessage: 'Lengd gæslu uppfærð',
        description:
          'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá afgreiddra mála.',
      },
    }),
  },
}
