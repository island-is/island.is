import { range } from 'lodash'
import { RegulationsSearchSectionProps } from './RegulationsSearchSection'

export type MinistryListItem = {
  name: string
  shortCode: string
  legacy?: true
}
export const allMinistries: Array<MinistryListItem> = [
  {
    name: 'Atvinnuvega- og nýsköpunarráðuneytið',
    shortCode: 'ANR',
  },
  { name: 'Dómsmálaráðuneytið', shortCode: 'DR' },
  { name: 'Hjaðningavígaráðuneytið', shortCode: 'HVR', legacy: true },
  { name: 'Heilbrigðisráðuneytið', shortCode: 'HR' },
]

type LawSubChapter = {
  name: string
  numberCode: string // '01a' |'01b' |'01c' | etc.
}
export type LawChapter = {
  name: string
  numberCode: string // '01' | '02' | '03' | etc.
  subChapters: Array<LawSubChapter>
}

export const allLawChaptersFlat: Array<LawChapter> = [
  {
    numberCode: '01',
    name: 'Stjórnskipunarlög o.fl.',
    subChapters: [
      { numberCode: '01a', name: 'Stjórnskipunarlög' },
      { numberCode: '01b', name: 'Yfirráðasvæði ríkisins' },
      { numberCode: '01c', name: 'Þjóðfáni, skjaldarmerki, o.fl.' },
      { numberCode: '01d', name: 'Þjóðaratkvæðagreiðslur' },
    ],
  },
  {
    numberCode: '02',
    name: 'Manréttindi',
    subChapters: [{ numberCode: '02a', name: 'Jafnrétti kynja' }],
  },
  {
    numberCode: '03',
    name: 'Forseti slands',
    subChapters: [],
  },
  {
    numberCode: '04',
    name: 'Alþingi og lagasetning',
    subChapters: [{ numberCode: '04a', name: 'Birting laga o.fl.' }],
  },
  {
    numberCode: '05',
    name: 'Dómstólar og réttarfar',
    subChapters: [
      { numberCode: '05a', name: 'Dómstólaskipan' },
      { numberCode: '05b', name: 'Fullnustugerðir' },
      { numberCode: '05c', name: 'Lögmenn o.fl.' },
      { numberCode: '05d', name: 'Meðferð einkamála' },
      { numberCode: '05e', name: 'Meðferð sakamála' },
      { numberCode: '05f', name: 'Skipti' },
      { numberCode: '05g', name: 'Ýmislegt' },
    ],
  },
]

export type RegulationListItem = {
  name: string
  title: string
  ministry?: MinistryListItem
}
export const regulationsSearchResults: Array<RegulationListItem> = [
  {
    name: '1052/2020',
    title:
      'Reglugerð um (3.) breytingu á reglugerð nr. 1364/2019 um endurgreiðslu kostnaðar vegna þjónustu sjálfstætt starfandi sjúkraþjálfara sem starfa án samnings við Sjúkratryggingar Íslands.',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'HR'),
  },
  {
    name: '1051/2020',
    title: 'Reglugerð um takmörkun á samkomum vegna farsóttar.',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'HR'),
  },
  {
    name: '1050/2020',
    title: 'Reglugerð um gjöld fyrir einkaleyfi, vörumerki, hönnun o.fl.',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'ANR'),
  },
  {
    name: '1049/2020',
    title:
      'Reglugerð um (8.) breytingu á reglugerð nr. 678/2009 um raforkuvirki.',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'HR'),
  },
  {
    name: '1048/2020',
    title: 'Reglugerð um breytingu á reglugerð um útlendinga, nr. 540/2017.',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'DR'),
  },
  {
    name: '1029/2020',
    title:
      'Reglugerð um (1.) breytingu á reglugerð nr. 871/2020, um heimildir hjúkrunarfræðinga og ljósmæðra til að ávísa lyfjum, um námskröfur og veitingu leyfa.',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'HR'),
  },
  {
    name: '1016/2020',
    title:
      'Reglugerð um (2.) breytingu á reglugerð nr. 958/2020, um takmörkun á skólastarfi vegna farsóttar.',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'HR'),
  },
  {
    name: '1014/2020',
    title:
      'Reglugerð um gildistöku framkvæmdarreglugerðar framkvæmdastjórnarinnar (ESB) 2020/466 um tímabundnar ráðstafanir til að halda í skefjum áhættu fyrir heilbrigði manna og dýra og plöntuheilbrigði og velferð dýra við tiltekna alvarlega röskun á eftirlitskerfum aðildarríkjanna vegna kórónaveirufaraldursins (COVID-19).',
    ministry: allMinistries.find(({ shortCode }) => shortCode === 'ANR'),
  },
]

export const regulationYears = range(1999, 2021).filter(
  (y) => y <= 2003 || y >= 2006,
)

const _searchTexts = {
  searchTitleLabel: 'Leita að reglugerðum',
  searchClearLabel: 'Núllstilla',
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

export const uiTexts = {
  navigationTitle: 'Upplýsingasvæði',
  regulationsLegend: 'Reglugerðir',
  regulationsIntro:
    'Eitthvað hressandi um reglugerðir og fleira skemmtilegt og fræðandi.',

  crumbs_1: 'Ísland.is',
  crumbs_2: 'Upplýsingaasvæði',

  ..._searchTexts,
} as const
