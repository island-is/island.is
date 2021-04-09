declare const _RegNameToken_: unique symbol
/** Regulation name – `0123/2012` */
export type RegName = string & { [_RegNameToken_]: true }

declare const _RegNameQueryToken_: unique symbol
/** Regulation name formatted for URL param insertion – `0123-2012` */
export type RegQueryName = string & { [_RegNameQueryToken_]: true }

declare const _ISODateToken_: unique symbol
/** Valid ISODate string – e.g. `2012-09-30` */
export type ISODate = string & { [_ISODateToken_]: true }

// ---------------------------------------------------------------------------

// Regulation name, need to replace / with - before sending to the api
export const demoRegName = '0244/2021'.replace('/', '-') as RegQueryName

// ---------------------------------------------------------------------------

// Years
export type RegulationYears = ReadonlyArray<number>
export const demoRegulationsYears: RegulationYears = [2020, 2021]

// ---------------------------------------------------------------------------

export type RegulationLawChapter = {
  /** Name (title) of the law chapter */
  name: string
  /** Short, URL-friendly token to use for search filters, etc.  */
  slug: string // '01a' |'01b' |'01c' | etc.
}

export type RegulationLawChapterTree = Array<
  RegulationLawChapter & {
    /** List of child-chapters for this top-level chapter.
     *
     * NOTE: The "tree" never goes more than one level down.
     */
    subChapters: ReadonlyArray<RegulationLawChapter>
  }
>

// ---------------------------------------------------------------------------

// Ministries
export type RegulationMinistry = {
  /** Name (title) of the ministry */
  name: string
  /** Short, URL-friendly token to use for search filters, etc.  */
  slug: string
  /** False if this ministry is not current */
  current: boolean
  /** Optional sorting weight hint.
   *
   * Lower numbers first, undefined/null last.
   */
  order?: number | null
}
export type RegulationMinistries = ReadonlyArray<RegulationMinistry>

export const demoRegulationsMinistries: RegulationMinistries = [
  {
    current: true,
    name: 'Forsætisráðuneyti',
    order: 1,
    slug: 'fsrn',
  },
  {
    current: true,
    name: 'Atvinnuvega- og nýsköpunarráðuneyti',
    order: 2,
    slug: 'avnsrn',
  },
]

// ---------------------------------------------------------------------------

export type RegulationHistoryItem = {
  /** The date this this history item took effect */
  date: ISODate
  /** Publication name of the affecting Regulation */
  name: RegName
  /** The title of the affecting Regulation */
  title: string
  /** Type of effect */
  effect: 'amend' | 'repeal'
}

// ---------------------------------------------------------------------------

export type RegulationEffect = {
  /** effectiveDate for this impact */
  date: ISODate
  /** Publication name of the affected Regulation */
  name: RegName
  /** Publication name of the affected Regulation */
  title: string
  /** Type of effect */
  effect: 'amend' | 'repeal'
}

// ---------------------------------------------------------------------------

// Regulations list
export type RegulationListItem = {
  /** Publication name */
  name: RegName
  /** The title of the Regulation */
  title: string
  /** The ministry that the regulation is linked to */
  ministry?: RegulationMinistry
  /** Publication date of this regulation */
  publishedDate: ISODate
}

export type RegulationSearchResults = {
  /** The number of the current page, 1-based  */
  page: number
  /** Total number of pages available for this query */
  perPage: number
  /** Total number of pages available for this query */
  totalPages: number
  /** ReguationListItems for this page */
  data: RegulationListItem[]
}

export const demoRegulations: RegulationSearchResults = {
  page: 1,
  perPage: 14,
  totalPages: 121,
  data: [
    {
      name: '0244/2021' as RegName,
      title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
      publishedDate: '2021-03-05' as ISODate,
    },
    {
      name: '0245/2021' as RegName,
      title: 'Reglugerð um (1.) breytingu á reglugerð nr. 101/2021.',
      publishedDate: '2021-03-04' as ISODate,
    },
  ],
}

// ---------------------------------------------------------------------------

/** Regulation appendix/attachment chapter */
export type RegulationAppendix = {
  /** Title of the appendix */
  title: string
  /** The appendix text in HTML format */
  text: string
}

// Single Regulation
export type Regulation = {
  /** Publication name (NNNN/YYYY) of the regulation */
  name: RegName
  /** The title of the regulation in HTML format */
  title: string
  /* The regulation text in HTML format */
  text: string
  /** List of the regulation's appendixes */
  appendixes: ReadonlyArray<RegulationAppendix>
  /** Optional HTML formatted comments from the editor pointing out
   * known errors or ambiguities in the text.
   */
  comments: string

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
  ministry?: RegulationMinistry
  /** Law chapters that this regulation is linked to */
  lawChapters: ReadonlyArray<RegulationLawChapter>
  // TODO: add link to original DOC/PDF file in Stjórnartíðindi's data store.

  /** Regulations are roughly classified based on whether they contain
   * any original text/stipulations, or whether they **only**  prescribe
   * changes to other regulations.
   *
   * `base` = Stofnreglugerð
   * `amending` = Breytingareglugerð
   */
  type: 'base' | 'amending'

  /** List of change events (Amendments, Repeals) over the life time of this
   * regulation – **excluding** the original base/root regulation
   */
  history: ReadonlyArray<RegulationHistoryItem>

  /** Date sorted list of effects this regulations has on other regulations
   * text-changes or cacellations
   */
  effects: ReadonlyArray<RegulationEffect>

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

export const demoRegulation: Regulation = {
  name: '0244/2021' as RegName,
  title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
  text: '<p>Lorem ipsum dolor</p>',
  appendixes: [],
  // comments: '<p>Þessi reglugerð er bara prufureglugerð.</p>',
  comments: '',

  effectiveDate: '2021-03-06' as ISODate,
  publishedDate: '2021-03-05' as ISODate,
  signatureDate: '2021-02-18' as ISODate,
  lastAmendDate: '2021-02-18' as ISODate,
  // repealedDate: '2021-09-30' as ISODate,

  type: 'base',
  history: [],
  effects: [],

  ministry: {
    name: 'Samgöngu- og sveitarstjórnarráðuneyti',
    slug: 'ssvrn',
    current: false,
  },
  lawChapters: [],

  // timelineDate: '2021-03-05' as ISODate,
  // showingDiff: {
  //   from: '2021-03-05' as ISODate,
  //   to: '2021-02-18' as ISODate,
  // },
}

// ---------------------------------------------------------------------------

export type RegulationRedirect = {
  /** Publication name (NNNN/YYYY) of the regulation */
  name: RegName
  /** The title of the regulation in HTML format */
  title: string
  /** The regulation data has not been fully migrated and should be viewed at this URL */
  redirectUrl: string
}

export const demoRegulationRedirect: RegulationRedirect = {
  name: '0504/1975' as RegName,
  title: 'Reglugerð um gatnagerðargjöld í Hvolhreppi, Rangárvallasýslu.',
  redirectUrl: 'https://www.reglugerd.is/reglugerdir/allar/nr/0504-1975',
}
