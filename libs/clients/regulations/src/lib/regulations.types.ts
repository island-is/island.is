// Regulation name, need to replace / with - before sending to the api
export const demoRegulationName = '0244/2021'.replace('/','-');

// Years
export type RegulationsYears = number[]
export const demoRegulationsYears: RegulationsYears = [2020, 2021]

// Ministries
export type RegulationsMinistry = {
  name: string
  slug: string
  current: boolean
  order: number
}
export type RegulationsMinistries = RegulationsMinistry[]

export const demoRegulationsMinistries: RegulationsMinistries = [
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

// Regulations list
export type RegulationsItem = {
  name: string
  title: string
  publishedDate: string
}
export type Regulations = {
  page: number
  totalPages: number
  data: RegulationsItem[]
}

export const demoRegulations: Regulations = {
  page: 1,
  totalPages: 121,
  data: [
    {
      name: '0244/2021',
      title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
      publishedDate: '2021-03-05T00:00:00.000Z',
    },
    {
      name: '0245/2021',
      title: 'Reglugerð um (1.) breytingu á reglugerð nr. 101/2021.',
      publishedDate: '2021-03-04T00:00:00.000Z',
    },
  ],
}

// Single Regulation
export type Regulation = {
  name: string
  text: string
  title: string
  ministry: {
    name: string
    slug: string
  }
  appendixes: string[]
  lawChapters: string[]
  effectiveDate: string
  publishedDate: string
  signatureDate: string
  lastAmendDate: string
}

export const demoRegulation: Regulation = {
  name: '0244/2021',
  title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
  text: 'Lorem ipsum dolor',
  ministry: {
    name: 'Samgöngu- og sveitarstjórnarráðuneyti',
    slug: 'ssvrn',
  },
  appendixes: [],
  lawChapters: [],
  effectiveDate: '2021-03-06T00:00:00.000Z',
  publishedDate: '2021-03-05T00:00:00.000Z',
  signatureDate: '2021-02-18T00:00:00.000Z',
  lastAmendDate: '2021-02-18T00:00:00.000Z',
}
