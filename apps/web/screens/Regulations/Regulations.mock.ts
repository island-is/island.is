import {
  Ministry,
  MinistryFull,
  RegName,
  RegulationListItem,
} from './Regulations.types'

export const allMinistries: Array<MinistryFull> = [
  {
    name: 'Atvinnuvega- og nýsköpunarráðuneytið',
    slug: 'ANR',
    current: true,
  },
  { name: 'Dómsmálaráðuneytið', slug: 'DR', current: true },
  { name: 'Heilbrigðisráðuneytið', slug: 'HR', current: true },
  { name: 'Danmerkurmálaráðuneytið', slug: 'HVR', current: false },
  { name: 'Innanríkisráðuneyti', slug: 'IR', current: false },
]

const _getMinistry = (slug: string): Ministry =>
  allMinistries.find((m) => m.slug === slug) || allMinistries[0]

export const regulationsSearchResults: Array<RegulationListItem> = [
  {
    name: '0221/2001' as RegName,
    title: 'Reglugerð um bólusetningar á Íslandi.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1052/2020' as RegName,
    title:
      'Reglugerð um (3.) breytingu á reglugerð nr. 1364/2019 um endurgreiðslu kostnaðar vegna þjónustu sjálfstætt starfandi sjúkraþjálfara sem starfa án samnings við Sjúkratryggingar Íslands.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1051/2020' as RegName,
    title: 'Reglugerð um takmörkun á samkomum vegna farsóttar.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1050/2020' as RegName,
    title: 'Reglugerð um gjöld fyrir einkaleyfi, vörumerki, hönnun o.fl.',
    ministry: _getMinistry('ANR'),
  },
  {
    name: '1049/2020' as RegName,
    title:
      'Reglugerð um (8.) breytingu á reglugerð nr. 678/2009 um raforkuvirki.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1048/2020' as RegName,
    title: 'Reglugerð um breytingu á reglugerð um útlendinga, nr. 540/2017.',
    ministry: _getMinistry('DR'),
  },
  {
    name: '1029/2020' as RegName,
    title:
      'Reglugerð um (1.) breytingu á reglugerð nr. 871/2020, um heimildir hjúkrunarfræðinga og ljósmæðra til að ávísa lyfjum, um námskröfur og veitingu leyfa.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1016/2020' as RegName,
    title:
      'Reglugerð um (2.) breytingu á reglugerð nr. 958/2020, um takmörkun á skólastarfi vegna farsóttar.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1014/2020' as RegName,
    title:
      'Reglugerð um gildistöku framkvæmdarreglugerðar framkvæmdastjórnarinnar (ESB) 2020/466 um tímabundnar ráðstafanir til að halda í skefjum áhættu fyrir heilbrigði manna og dýra og plöntuheilbrigði og velferð dýra við tiltekna alvarlega röskun á eftirlitskerfum aðildarríkjanna vegna kórónaveirufaraldursins (COVID-19).',
    ministry: _getMinistry('ANR'),
  },
]

// ---------------------------------------------------------------------------

export const homeTexts = {
  // navigationTitle: 'Upplýsingasvæði',
  homeIntroLegend: 'Reglugerðir',
  homeIntro:
    'Eitthvað hressandi um reglugerðir og fleira skemmtilegt og fræðandi.',

  homeIntroImageUrl: 'https://placekitten.com/400/400',
  homeIntroImageThumbnailUrl: 'https://placekitten.com/50/50',

  defaultRegulationListsLegend: 'Nýlegar reglugerðir',
  searchResultsLegend: 'Leitarniðurstöður',

  regTypeBase: 'Stofnreglugerð',
  regTypeAmending: 'Breytingareglugerð',

  searchTitleLabel: 'Leita að reglugerðum',
  searchClearLabel: 'Núllstilla leit',
  searchOpenLabel: 'Opna leit',
  searchCloseLabel: 'Loka leit',
  searchResultLabel: 'Sýna niðurstöður',

  searchQueryLabel: 'Útgáfunúmer eða leitarorð',
  searchYearLabel: 'Útgáfuár',
  searchYearPlaceholder: 'Veldu útgáfuár',
  searchYearEmptyOption: 'Öll ár',
  searchChapterLabel: 'Lagasafn',
  searchChapterPlaceholder: 'Kafli í Lagasafni',
  searchChapterEmptyOption: 'Allir kaflar',
  searchMinistryLabel: 'Ráðuneyti',
  searchMinistryPlaceholder: 'Veldu ráðuneyti',
  searchMinistryEmptyOption: 'Öll ráðuneyti',
  searchLegacyMinistrySuffix: '(fyrrverandi ráðuneyti)',
  searchIncludeAmendingLabel: 'Leita líka í breytingareglugerðum',

  // crumbs_1: 'Ísland.is',
  // crumbs_2: 'Upplýsingasvæði',
}

// export type RegulationHomeTexts = Partial<typeof homeTexts>
export type RegulationHomeTexts = Partial<typeof homeTexts>

// ===========================================================================
// ===========================================================================

export const regulationPageTexts = {
  redirectText: 'Þessi reglugerð er enn sem komið er hýst á eldri vefslóð:',

  showDiff: 'Sýna breytingar',
  hideDiff: 'Fela breytingar',

  regTypeBase: 'Stofnreglugerð',
  regTypeAmending: 'Breytingareglugerð',

  effectsTitle: 'Áhrif %{name} á aðrar reglugerðir',
  effectsChange: 'breytir %{name}',
  effectsCancel: 'fellir brott %{name}',

  historyTitle: 'Breytingasaga reglugerðar %{name}',
  historyStart: 'Upprunaleg útgáfa',
  historyChange: 'breytt af %{name}',
  historyCancel: 'brottfelld af %{name}',
  historyCurrentVersion: 'Núgildandi útgáfa',
  historyFutureSplitter: 'Væntanlegar breytingar',

  infoTitle: 'Upplýsingar',

  viewAffectingRegulation: 'Skoða %{title}',

  comments: 'Athugsemdir vefstjóra',

  // crumbs_1: 'Ísland.is',
  // crumbs_2: 'Upplýsingasvæði',
  // crumbs_3: 'Reglugerðir',
}

export type RegulationPageTexts = Partial<typeof regulationPageTexts>
