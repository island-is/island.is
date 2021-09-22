export type Stadfang = {
  stadfanganr: string
  stadvisir: string // Tæknilega rétt hugtak—oftast gotuheiti
  stadgreinir: string // Tæknilega rétt hugtak—oftast húsnúmer
  postnr: string | number
  sveitarfelag: string
  landeignarnr: string // ID sem hægt væri að fletta upp/vísa í seinna

  birting?: string
  birtingStutt?: string // T.d. Snorrabraut 56
}

export type ThinglysturEigandi = {
  nafn: string
  kennitala: string
  eignarhlutfall?: number
  kaupdagur: Date
  heimild?: string // PROBABLY NOT

  display?: string // Birting á hlutfalli, tilbúið fyrir viðmót, t.d. "50.12%"
  heimildBirting?: string // Birting á heimild
}

export type Fasteignamat = {
  gildandiFasteignamat: number
  gildandiAr: string // Í staðinn fyrir að viðmót þurfi að reikna, t.d. "2022"
  fyrirhugadFasteignamat?: number | null
  fyrirhugadAr?: string | null
}

export type Notkunareining = {
  fasteignanumer: string | number
  notkunareininganumer: string | number

  stadfang?: Stadfang
  // OR
  Stadfong?: Array<Stadfang>

  merking: string

  // Munur á þessu þrennu? Notkun+starfsemi í vefuppfletti, lysing á skra.is
  notkun?: string // Á að vera inni
  notkunBirting: string
  starfsemi: string // Ný í stað notkun, bara fyrir, birta? óstaðfest
  lysing: string // Sama og skyring. Frjáls texti, yfirleitt notkun, birta? óstaðfest
  // notkunBirting // ?

  byggingarAr: string | number
  birtStaerd: string | number
  byggingararBirting: string

  fasteignamat: Fasteignamat
  lodarmat: number | null
  brunabotamat: number | null
}

export type Fasteign = {
  fasteignanumer: string | number
  sjalfgefidStadfang: Stadfang

  // Allt hér fyrir neðan er optional
  fasteignamat?: Fasteignamat

  // Flækjum svar til að geta meðhöndlað mjög marga eigendur
  thinglystirEigendur?: ThinglystirEigendurResponse

  // Flækjum svar til að geta meðhöndlað mjög margar notkunareiningar
  notkunareiningar?: NotkunareiningarResponse
}

// Kerfistýpur
export type Villa = {
  code: number // Þekktur villukóði
  message: string | null // Lesanleg villuskilaboð
}

// paging = null gefur það til kynna að aðeins þau gögn sem skilað sé, séu til
export type Paging = {
  page: number
  pageSize: number // Eða limit (perPage)
  totalPages: number
  offset: number
  total: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type FasteignirResponse = {
  paging: Paging | null
  fasteignir: Array<Fasteign>
}

export type NotkunareiningarResponse = {
  paging: Paging | null
  data: Array<Notkunareining>
}

export type ThinglystirEigendurResponse = {
  paging: Paging | null
  data: Array<ThinglysturEigandi>
}
