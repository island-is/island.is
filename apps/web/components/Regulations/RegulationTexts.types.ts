// ---------------------------------------------------------------------------

export type RegulationHomeTexts = Partial<
  Record<
    | 'homeIntroLegend' // 'Reglugerðir'
    | 'homeIntro' // 'Eitthvað hressandi um reglugerðir og fleira skemmtilegt og fræðandi.'
    | 'homeIntroImageUrl' // 'https://placekitten.com/400/400'
    | 'homeIntroImageThumbnailUrl' // 'https://placekitten.com/50/50'
    | 'defaultRegulationListsLegend' // 'Nýlegar reglugerðir'
    | 'searchResultsLegend' // 'Leitarniðurstöður'
    | 'regTypeBase' // 'Stofnreglugerð'
    | 'regTypeAmending' // 'Breytingareglugerð'
    | 'searchTitleLabel' // 'Leita að reglugerðum'
    | 'searchClearLabel' // 'Núllstilla leit'
    | 'searchOpenLabel' // 'Opna leit'
    | 'searchCloseLabel' // 'Loka leit'
    | 'searchResultLabel' // 'Sýna niðurstöður'
    | 'searchQueryLabel' // 'Útgáfunúmer eða leitarorð'
    | 'searchYearLabel' // 'Útgáfuár'
    | 'searchYearPlaceholder' // 'Veldu útgáfuár'
    | 'searchYearEmptyOption' // 'Öll ár'
    | 'searchChapterLabel' // 'Lagasafn'
    | 'searchChapterPlaceholder' // 'Kafli í Lagasafni'
    | 'searchChapterEmptyOption' // 'Allir kaflar'
    | 'searchMinistryLabel' // 'Ráðuneyti'
    | 'searchMinistryPlaceholder' // 'Veldu ráðuneyti'
    | 'searchMinistryEmptyOption' // 'Öll ráðuneyti'
    | 'searchLegacyMinistrySuffix' // '(fyrrverandi ráðuneyti)'
    | 'searchIncludeAmendingLabel', // 'Leita líka í breytingareglugerðum'
    // |'crumbs_1' // 'Ísland.is'
    // |'crumbs_2' // 'Upplýsingasvæði'
    string
  >
>

// ===========================================================================
// ===========================================================================

export type RegulationPageTexts = Partial<
  Record<
    | 'goBack' // 'Til baka'
    | 'printThisVersion' // 'Prenta þessa útgáfu'
    | 'redirectText' // 'Þessi reglugerð er enn sem komið er hýst á eldri vefslóð:'
    | 'showDiff' // 'Sýna breytingar'
    | 'hideDiff' // 'Fela breytingar'
    | 'regTypeBase' // 'Stofnreglugerð'
    | 'regTypeAmending' // 'Breytingareglugerð'
    | 'appendixesTitle' // 'Viðaukar'
    | 'appendixGenericTitle' // 'Viðauki'
    | 'commentsTitle' // 'Athugasemdir ritstjóra'
    | 'affectingLinkPrefix' // 'Breytingar vegna'
    | 'affectingListLegend' // 'Reglugerðir sem kveða á um þessar breytingar'
    | 'effectsTitle' // 'Áhrif %{name} á aðrar reglugerðir'
    | 'effectsChange' // 'Breytir %{name}'
    | 'effectsCancel' // 'Fellir brott %{name}'
    | 'historyTitle' // 'Breytingasaga reglugerðar %{name}'
    | 'historyStart' // 'Upprunaleg útgáfa'
    | 'historyChange' // 'Breytt af %{name}'
    | 'historyCancel' // 'Brottfelld af %{name}'
    | 'historyCurrentVersion' // 'Núgildandi útgáfa'
    | 'historyFutureSplitter' // 'Væntanlegar breytingar'
    | 'infoboxTitle' // 'Upplýsingar'
    | 'infoboxMinistry' // 'Ráðuneyti'
    | 'infoboxLawChapters' // 'Lagakaflar'
    | 'infoboxEffectiveDate' // 'Tók gildi'
    | 'infoboxLastAmended' // 'Síðast breytt'
    | 'infoboxRepealed' // 'Féll úr gildi'
    | 'viewAffectingRegulation', // 'Skoða %{title}'
    // |'crumbs_1' // 'Ísland.is'
    // |'crumbs_2' // 'Upplýsingasvæði'
    // |'crumbs_3', // 'Reglugerðir'
    string
  >
>
