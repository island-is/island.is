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
    | 'goHome' // 'Yfirlit reglugerða'
    | 'originalDocLink' // 'Skjal í Stjórnartíðindum'
    | 'downloadPdf' // 'Þessi útgáfa á PDF formi'
    | 'copyPermaLink' // "Afrita hlekk á þessa útgáfu"
    | 'redirectText' // 'Þessi reglugerð er enn sem komið er hýst á eldri vefslóð:'
    | 'showDiff' // 'Sýna breytingar'
    | 'hideDiff' // 'Fela breytingar'
    | 'showDiff_fromOriginal' // 'Sjá allar breytingar frá upphafi'
    | 'showDiff_fromLast' // 'Sjá síðustu breytingar'
    | 'nextVersion' // 'Næsta útgáfa'
    | 'previousVersion' // 'Fyrri útgáfa'
    | 'appendixesTitle' // 'Viðaukar'
    | 'appendixGenericTitle' // 'Viðauki'
    | 'commentsTitle' // 'Athugasemdir ritstjóra'
    | 'disclaimerTitle' // 'Fyrirvari'
    | 'disclaimerMd' // '
    //   Reglugerðir eru birtar í B-deild Stjórnartíðinda skv. 3. gr. laga um Stjórnartíðindi og Lögbirtingablað, nr. 15/2005, sbr. reglugerð um útgáfu Stjórnartíðinda nr. 958/2005.\n\n
    //   Sé misræmi milli þess texta sem birtist hér í safninu og þess sem birtur er í útgáfu B-deildar Stjórnartíðinda skal sá síðarnefndi ráða.
    // '
    | 'indexLegend' // 'Efnisyfirlit'
    | 'indexToggler_open' // 'Birta efnisyfirlit'
    | 'indexToggler_close' // 'Fela efnisyfirlit'
    | 'indexItem_regulation' // 'Reglugerð'
    | 'indexItem_comments' // 'Athugasemdir ritstjóra'
    | 'printedDate' // 'Prentað þann'
    | 'statusCurrentBase' // 'Stofnreglugerð'
    | 'statusCurrentAmending' // 'Breytingareglugerð'
    | 'statusCurrentUpdated' // 'Reglugerð með breytingum'
    | 'statusCurrent_amended' // 'síðast uppfærð ${date}'
    | 'statusOgildWat' // 'Ógild reglugerð'
    | 'statusRepealed' // 'Brottfelld reglugerð'
    | 'statusRepealed_on' // 'féll úr gildi ${date}'
    | 'statusOriginal' // 'Upprunaleg útgáfa reglugerðar'
    | 'statusHistoric' // 'Eldri útgáfa reglugerðar'
    | 'statusHistoric_period' // 'gilti á tímabilinu ${dateFrom} – ${dateTo}'
    | 'statusHasPending' // 'Reglugerð án breytinga, sjá breytingasögu.'
    | 'statusUpcoming' // 'Væntanleg útgáfa reglugerðar'
    | 'statusUpcoming_on' // 'mun taka gildi ${date}'
    | 'statusUpcoming_period' // 'mun gilda frá ${dateFrom} – ${dateTo}'
    | 'statusLinkToCurrent' // 'sjá núgildandi'
    | 'statusLinkToCurrent_long' // 'Sjá núgildandi útgfáfu reglugerðarinnar'
    | 'statusLinkToRepealed' // 'sjá lokaútgáfu'
    | 'statusLinkToRepealed_long' // 'Sjá lokaútgfáfu reglugerðarinnar'
    | 'statusOnDate_past' // 'eins og hún var ${date}'
    | 'statusOnDate_future' // 'eins og hún líklega verður ${date}'
    | 'affectingLinkPrefix' // 'Breytingar gerðar ${dates} af reglugerð'
    | 'affectingLinkPrefixPlural' // 'Breytingar gerðar ${dates} af reglugerðum'
    | 'affectingLinkDateRange' // '${dateFrom} – ${dateTo}'
    | 'effectsTitle' // 'Áhrif ${name} á aðrar reglugerðir'
    | 'effectsChange' // 'Breytir ${name}'
    | 'effectsCancel' // 'Fellir brott ${name}'
    | 'historyTitle' // 'Breytingasaga reglugerðar ${name}'
    | 'historyStart' // 'Stofnreglugerð gefin út'
    | 'historyStartAmending' // 'Reglugerðin gefin út'
    | 'historyChange' // 'Breytt með ${name}'
    | 'historyCancel' // 'Brottfelld af ${name}'
    | 'historyCurrentVersion' // 'Núgildandi útgáfa'
    | 'historyPastSplitter' // 'Gildandi breytingar'
    | 'historyFutureSplitter' // 'Væntanlegar breytingar'
    | 'infoboxTitle' // 'Upplýsingar'
    | 'infoboxMinistry' // 'Ráðuneyti'
    | 'infoboxLawChapters' // 'Lagakaflar'
    | 'infoboxEffectiveDate' // 'Tók fyrst gildi'
    | 'infoboxPublishedDate' // 'Upprunalegur útgáfudagur'
    | 'infoboxLastAmended' // 'Síðast breytt'
    | 'infoboxRepealed' // 'Féll úr gildi'
    | 'infoboxOgildWat' // 'Ógild reglugerð'
    | 'viewAffectingRegulation', // 'Skoða ${title}'
    string
  >
>
