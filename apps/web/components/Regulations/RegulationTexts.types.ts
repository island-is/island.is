// ---------------------------------------------------------------------------

export type RegulationHomeTexts = Partial<
  Record<
    | 'homeIntroLegend' // 'Reglugerðasafn'
    | 'homeIntro' // 'Eitthvað hressandi um reglugerðir og fleira skemmtilegt og fræðandi.'
    | 'homeIntroShowDetails' // 'Sjá nánar um safnið og fyrirvara'
    | 'homeNewestRegulations' // 'Nýjustu reglugerðirnar'
    | 'defaultRegulationListsLegend' // 'Nýlegar reglugerðir'
    | 'searchResultsLegend' // 'Leitarniðurstöður'
    | 'searchResultCountZero' // 'Engar reglugerðir fundust fyrir þessi leitarskilyrði.'
    | 'searchResultCountPlural' // '${count} reglugerðir fundust'
    | 'searchResultCountSingular' // '${count} reglugerð fannst'
    | 'searchClearLabel' // 'Núllstilla leit'
    | 'searchQueryLabel' // 'Útgáfunúmer / Leitarorð'
    | 'searchYearLabel' // 'Útgáfuár'
    | 'searchYearPlaceholder' // 'Veldu ár'
    | 'searchYearEmptyOption' // 'Öll ár'
    | 'searchChapterLabel' // 'Kafli í lagasafni'
    | 'searchChapterPlaceholder' // 'Veldu kafla'
    | 'searchChapterEmptyOption' // 'Allir kaflar'
    | 'searchMinistryLabel' // 'Ráðuneyti'
    | 'searchMinistryPlaceholder' // 'Veldu ráðuneyti'
    | 'searchMinistryEmptyOption' // 'Öll ráðuneyti'
    | 'searchIncludeAmendingLabel' // 'Leita í breytingareglugerðum'
    | 'searchIncludeRepealedLabel', // 'Leita í brottföllnum reglugerðum'
    string
  >
>

// ===========================================================================
// ===========================================================================

export type RegulationPageTexts = Partial<
  Record<
    | 'goBack' // 'Til baka'
    | 'printThisVersion' // 'Prenta þessa útgáfu'
    | 'copyPermaLink' // "Afrita hlekk á þessa útgáfu"
    | 'redirectText' // 'Þessi reglugerð er enn sem komið er hýst á eldri vefslóð:'
    | 'showDiff' // 'Sýna breytingar'
    | 'hideDiff' // 'Fela breytingar'
    | 'appendixesTitle' // 'Viðaukar'
    | 'appendixGenericTitle' // 'Viðauki'
    | 'commentsTitle' // 'Athugasemdir ritstjóra'
    | 'ministryTransfer' // 'Nýr ábyrgðaraðili: ${ministry} (var fyrir ${prevMinistry})'
    | 'affectingLinkPrefix' // 'Breytingar gerðar ${dates} vegna'
    | 'affectingLinkDateRange' // '${dateFrom} – ${dateTo}'
    | 'effectsTitle' // 'Áhrif ${name} á aðrar reglugerðir'
    | 'effectsChange' // 'Breytir ${name}'
    | 'effectsCancel' // 'Fellir brott ${name}'
    | 'historyTitle' // 'Breytingasaga reglugerðar ${name}'
    | 'historyStart' // 'Stofnreglugerð tók gildi'
    | 'historyStartAmending' // 'Reglugerðin tók gildi'
    | 'historyChange' // 'Breytt af ${name}'
    | 'historyCancel' // 'Brottfelld af ${name}'
    | 'historyCurrentVersion' // 'Núgildandi útgáfa'
    | 'historyPastSplitter' // 'Gildandi breytingar'
    | 'historyFutureSplitter' // 'Væntanlegar breytingar'
    | 'infoboxTitle' // 'Upplýsingar'
    | 'infoboxMinistry' // 'Ráðuneyti'
    | 'infoboxLawChapters' // 'Lagakaflar'
    | 'infoboxEffectiveDate' // 'Tók fyrst gildi'
    | 'infoboxLastAmended' // 'Síðast breytt'
    | 'infoboxRepealed' // 'Féll úr gildi'
    | 'viewAffectingRegulation', // 'Skoða ${title}'
    string
  >
>
