import { range } from 'lodash'
import {
  regulationHtml,
  regulationHtmlOriginal,
} from './mockData-regulationHtml'

// ---------------------------------------------------------------------------

export type Ministry = {
  /** Name (title) of the ministry */
  name: string
  /** Short, URL-friendly token to use for search filters, etc.  */
  slug: string
  /** Custom sorting modifier – i.e. to push Forsætisráðuneytið to the top of a list. */
  order?: number
  /** True if this ministry is not current */
  legacy?: true
}
export const allMinistries: Array<Ministry> = [
  {
    name: 'Atvinnuvega- og nýsköpunarráðuneytið',
    slug: 'ANR',
  },
  { name: 'Dómsmálaráðuneytið', slug: 'DR' },
  { name: 'Hjaðningavígaráðuneytið', slug: 'HVR', legacy: true },
  { name: 'Heilbrigðisráðuneytið', slug: 'HR' },
  { name: 'Innanríkisráðuneyti', slug: 'IR', legacy: true },
]

const _getMinistry = (slug: string): Ministry =>
  allMinistries.find((m) => m.slug === slug) || allMinistries[0]

// ---------------------------------------------------------------------------

export type LawChapter = {
  /** Name (title) of the LawChapter */
  name: string
  /** Short, URL-friendly token to use for search filters, etc.  */
  slug: string // '01a' |'01b' |'01c' | etc.
}

export type LawChapterTree = Array<
  LawChapter & {
    /** List of child-chapters for this top-level chapter.
     *
     * NOTE: The "tree" never goes more than one level down.
     */
    subChapters: ReadonlyArray<LawChapter>
  }
>

export const allLawChaptersTree: LawChapterTree = [
  {
    slug: '01',
    name: 'Stjórnskipunarlög o.fl.',
    subChapters: [
      { slug: '01a', name: 'Stjórnskipunarlög' },
      { slug: '01b', name: 'Yfirráðasvæði ríkisins' },
      { slug: '01c', name: 'Þjóðfáni, skjaldarmerki, o.fl.' },
      { slug: '01d', name: 'Þjóðaratkvæðagreiðslur' },
    ],
  },
  {
    slug: '02',
    name: 'Manréttindi',
    subChapters: [{ slug: '02a', name: 'Jafnrétti kynja' }],
  },
  {
    slug: '03',
    name: 'Forseti slands',
    subChapters: [],
  },
  {
    slug: '04',
    name: 'Alþingi og lagasetning',
    subChapters: [{ slug: '04a', name: 'Birting laga o.fl.' }],
  },
  {
    slug: '05',
    name: 'Dómstólar og réttarfar',
    subChapters: [
      { slug: '05a', name: 'Dómstólaskipan' },
      { slug: '05b', name: 'Fullnustugerðir' },
      { slug: '05c', name: 'Lögmenn o.fl.' },
      { slug: '05d', name: 'Meðferð einkamála' },
      { slug: '05e', name: 'Meðferð sakamála' },
      { slug: '05f', name: 'Skipti' },
      { slug: '05g', name: 'Ýmislegt' },
    ],
  },
]

// ---------------------------------------------------------------------------

export type RegulationListItem = {
  /** Publication name */
  name: string
  /** The title of the Regulation */
  title: string
  /** The ministry that the regulation is linked to */
  ministry?: Ministry
}
export const regulationsSearchResults: Array<RegulationListItem> = [
  {
    name: '0221/2001',
    title: 'Reglugerð um bólusetningar á Íslandi.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1052/2020',
    title:
      'Reglugerð um (3.) breytingu á reglugerð nr. 1364/2019 um endurgreiðslu kostnaðar vegna þjónustu sjálfstætt starfandi sjúkraþjálfara sem starfa án samnings við Sjúkratryggingar Íslands.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1051/2020',
    title: 'Reglugerð um takmörkun á samkomum vegna farsóttar.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1050/2020',
    title: 'Reglugerð um gjöld fyrir einkaleyfi, vörumerki, hönnun o.fl.',
    ministry: _getMinistry('ANR'),
  },
  {
    name: '1049/2020',
    title:
      'Reglugerð um (8.) breytingu á reglugerð nr. 678/2009 um raforkuvirki.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1048/2020',
    title: 'Reglugerð um breytingu á reglugerð um útlendinga, nr. 540/2017.',
    ministry: _getMinistry('DR'),
  },
  {
    name: '1029/2020',
    title:
      'Reglugerð um (1.) breytingu á reglugerð nr. 871/2020, um heimildir hjúkrunarfræðinga og ljósmæðra til að ávísa lyfjum, um námskröfur og veitingu leyfa.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1016/2020',
    title:
      'Reglugerð um (2.) breytingu á reglugerð nr. 958/2020, um takmörkun á skólastarfi vegna farsóttar.',
    ministry: _getMinistry('HR'),
  },
  {
    name: '1014/2020',
    title:
      'Reglugerð um gildistöku framkvæmdarreglugerðar framkvæmdastjórnarinnar (ESB) 2020/466 um tímabundnar ráðstafanir til að halda í skefjum áhættu fyrir heilbrigði manna og dýra og plöntuheilbrigði og velferð dýra við tiltekna alvarlega röskun á eftirlitskerfum aðildarríkjanna vegna kórónaveirufaraldursins (COVID-19).',
    ministry: _getMinistry('ANR'),
  },
]

// ---------------------------------------------------------------------------

export const regulationYears = range(1999, 2021).filter(
  (y) => y <= 2003 || y >= 2006,
)

// ---------------------------------------------------------------------------

const _searchTexts = {
  searchTitleLabel: 'Leita að reglugerðum',
  searchClearLabel: 'Núllstilla leit',
  searchOpenLabel: 'Opna leit',
  searchCloseLabel: 'Loka leit',
  searchResultLabel: 'Sýna niðurstöður',

  defaultRegulationsLegend: 'Nýútgefnar reglugerðir',
  searchResultsLegend: 'Leitarniðurstöður',

  searchFieldQueryLabel: 'Útgáfunúmer eða leitarorð',
  searchFieldYearLabel: 'Útgáfuár',
  searchFieldYearPlaceholder: 'Veldu útgáfuár',
  searchFieldYearEmptyOption: 'Öll ár',
  searchFieldChapterLabel: 'Lagasafn',
  searchFieldChapterPlaceholder: 'Kafli í Lagasafni',
  searchFieldChapterEmptyOption: 'Allir kaflar',
  searchFieldMinistryLabel: 'Ráðuneyti',
  searchFieldMinistryPlaceholder: 'Veldu ráðuneyti',
  searchFieldMinistryEmptyOption: 'Öll ráðuneyti',
  searchFieldLegacyMinistrySuffix: '(fyrrverandi ráðuneyti)',
  searchFieldIncludeAmendingLabel: 'Leita líka í breytingareglugerðum',
} as const

export type SearchTexts = typeof _searchTexts

export const homeTexts = {
  // navigationTitle: 'Upplýsingasvæði',
  regulationsLegend: 'Reglugerðir',
  regulationsIntro:
    'Eitthvað hressandi um reglugerðir og fleira skemmtilegt og fræðandi.',

  regulationsImageUrl: 'https://placekitten.com/400/400',
  regulationsImageThumbnailUrl: 'https://placekitten.com/50/50',

  crumbs_1: 'Ísland.is',
  crumbs_2: 'Upplýsingasvæði',

  ..._searchTexts,
} as const

// ===========================================================================
// ===========================================================================

export const regulationPageTexts = {
  historyTitle: 'Breytingasaga reglugerðar ',

  showDiff: 'Sýna breytingar',
  hideDiff: 'Fela breytingar',

  crumbs_1: 'Ísland.is',
  crumbs_2: 'Upplýsingasvæði',
  crumbs_3: 'Reglugerðir',
} as const

// ---------------------------------------------------------------------------

type ISODate = string

/** Regulation appendix/attachment chapter */
export type Appendix = {
  /** Title of the appendix */
  title: string
  /** The appendix text in HTML format */
  text: string
}

export type Regulation = {
  /** Publication name (NNNN/YYYY) of the regulation */
  name: string
  /** The title of the regulation in HTML format */
  title: string
  /* The regulation text in HTML format */
  text: string
  /** List of the regulation's appendixes */
  appendixes: ReadonlyArray<Appendix>
  /** Date signed in the ministry */
  signatureDate: ISODate
  /** Date officially published in Stjórnartíðindi */
  publishedDate: ISODate
  /** Date when the regulation took effect for the first time */
  effectiveDate: ISODate
  /** Date of last amendment of this regulation
   *
   * This date is always a past date – UNLESS a future timeline Date is being
   */
  lastAmendDate?: ISODate | null
  /** Date when (if) this regulation was repealed and became a thing of the past.
   *
   * NOTE: This date is **NEVER** set in the future
   */
  repealedDate?: ISODate | null
  /** The ministry this regulation is published by/linked to */
  ministry: Ministry
  /** Law chapters that this regulation is linked to */
  lawChapters: ReadonlyArray<LawChapter>
  // TODO: add link to original DOC/PDF file in Stjórnartíðindi's data store.

  /** Present if a NON-CURRENT version of the regulation is being served
   *
   * Is undefined by default (when the "current" version is served).
   */
  timelineDate?: ISODate

  /** Present if the regulation contains inlined change-markers (via htmldiff-js) */
  showingDiff?: {
    /** The date of the base version being compared against */
    from: ISODate
    /** The date of the version being viewed
     *
     * Generally the same as `timelineDate` defaulting to `lastAmendDate` */
    to: ISODate
  }
}

export const exampleRegulation: Regulation = {
  name: '0221/2001',
  title: 'Reglugerð um bólusetningar á Íslandi.',
  text: regulationHtml,
  appendixes: [],
  signatureDate: '2001-03-09',
  publishedDate: '2001-03-20',
  effectiveDate: '2001-03-20',
  lastAmendDate: '2021-03-03',
  repealedDate: null,
  ministry: _getMinistry('IR'),
  lawChapters: [allLawChaptersTree[0].subChapters[2]],
}

const foo: string = undefined

export const exampleRegulationOriginalBody = regulationHtmlOriginal

// ---------------------------------------------------------------------------

export type RegulationHistoryItem = {
  /** The date this this history item took effect */
  date: ISODate
  /** Publication name of the affecting Regulation */
  name: string
  /** The title of the affecting Regulation */
  title: string
  /** What type of history item is this.
   *
   * Staring with the regulation at the `root` of the timeline
   * ...possibly ending with the final `repeal` of that regulation
   */
  reason: 'root' | 'amend' | 'repeal'
}

export const regulationHistory: Array<RegulationHistoryItem> = [
  {
    date: '2013-09-13',
    name: '0904/2013',
    title:
      'Reglugerð um breytingu á reglugerð nr. 221/2001, um bólusetningar á Íslandi.',
    reason: 'amend',
  },
  {
    date: '2013-11-08',
    name: '0904/2013',
    title:
      'Reglugerð um breytingu á reglugerð nr. 221/2001, um bólusetningar á Íslandi.',
    reason: 'amend',
  },
  {
    date: '2019-12-24',
    name: '1197/2019',
    title:
      'Reglugerð um (2.) breytingu á reglugerð nr. 221/2001, um bólusetningar á Íslandi.',
    reason: 'amend',
  },
  {
    date: '2020-11-30',
    name: '1198/2020',
    title:
      'Reglugerð um (3.) breytingu á reglugerð nr. 221/2001, um bólusetningar á Íslandi.',
    reason: 'amend',
  },
]

// ---------------------------------------------------------------------------

export type Effect = {
  /** effectiveDate for this impact */
  date: ISODate
  /** Publication name of the affected Regulation */
  name: string
  /** Publication name of the affected Regulation */
  title: string
  /** Type of effect */
  type: 'amend' | 'repeal'
}

export type EffectList = Array<Effect>
