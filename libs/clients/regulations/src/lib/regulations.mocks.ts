import {
  HTMLText,
  ISODate,
  MinistrySlug,
  RegName,
  RegQueryName,
  Year,
} from '@island.is/regulations'
import {
  Regulation,
  RegulationMinistryList,
  RegulationRedirect,
  RegulationSearchResults,
  RegulationYears,
} from '@island.is/regulations/web'

// Regulation name, need to replace / with - before sending to the api
export const demoRegName = '0244/2021'.replace('/', '-') as RegQueryName

export const demoRegulationsYears: RegulationYears = [
  2020 as Year,
  2021 as Year,
]

export const demoRegulationsMinistries: RegulationMinistryList = [
  {
    name: 'Forsætisráðuneyti',
    order: 1,
    slug: 'fsrn' as MinistrySlug,
  },
  {
    name: 'Atvinnuvega- og nýsköpunarráðuneyti',
    order: 2,
    slug: 'avnsrn' as MinistrySlug,
  },
]

export const demoRegulations: RegulationSearchResults = {
  page: 1,
  perPage: 14,
  totalItems: 1691,
  totalPages: 121,
  data: [
    {
      name: '0244/2021' as RegName,
      title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
      publishedDate: '2021-03-05' as ISODate,
      ministry: demoRegulationsMinistries[0],
    },
    {
      name: '0245/2021' as RegName,
      title: 'Reglugerð um (1.) breytingu á reglugerð nr. 101/2021.',
      publishedDate: '2021-03-04' as ISODate,
      ministry: demoRegulationsMinistries[1],
    },
  ],
}

export const demoRegulation: Regulation = {
  name: '0244/2021' as RegName,
  title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
  text: '<p>Lorem ipsum dolor</p>' as HTMLText,
  appendixes: [],
  // comments: '<p>Þessi reglugerð er bara prufureglugerð.</p>',
  comments: '' as HTMLText,

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
    slug: 'ssvrn' as MinistrySlug,
  },
  lawChapters: [],
  originalDoc: 'https://www.stjornartidindi.is/foobar.pdf',

  repealed: false,

  // timelineDate: '2021-03-05' as ISODate,
  // showingDiff: {
  //   from: '2021-03-05' as ISODate,
  //   to: '2021-02-18' as ISODate,
  // },
}

export const demoRegulationRedirect: RegulationRedirect = {
  name: '0504/1975' as RegName,
  title: 'Reglugerð um gatnagerðargjöld í Hvolhreppi, Rangárvallasýslu.',
  redirectUrl: 'https://www.reglugerd.is/reglugerdir/allar/nr/0504-1975',
}
