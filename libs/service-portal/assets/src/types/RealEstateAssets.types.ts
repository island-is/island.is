export type Stadfang = {
  stadfanganr: string
  stadvisir: string // Tæknilega rétt hugtak—oftast gotuheiti
  stadgreinir: string // Tæknilega rétt hugtak—oftast húsnúmer
  postnr: string | number
  sveitarfelag: string
  landeignarnr: string // ID sem hægt væri að fletta upp/vísa í seinna

  display: string // Tilbúið til birtingar í viðmóti, t.d. Snorrabraut 56, Reykjavík
  displayShort: string // T.d. Snorrabraut 56
}

export type ThinglysturEigandi = {
  nafn: string
  kennitala: string
  eignarhlutfall?: number
  kaupdagur: Date
  heimild: string

  display?: string // Birting á hlutfalli, tilbúið fyrir viðmót, t.d. "50.12%"
}

export type Fasteignamat = {
  gildandi: number
  gildandiAr: string // Í staðinn fyrir að viðmót þurfi að reikna, t.d. "2022"
  fyrirhugad?: number | null
  fyrirhugadAr?: string | null
}

export type Notkunareining = {
  fasteignanr: string | number
  notkunareininganr: string | number

  stadfang: Stadfang
  // OR
  Stadfong: Array<Stadfang>

  merking: string

  // Munur á þessu þrennu? Notkun+starfsemi í vefuppfletti, lysing á skra.is
  notkun: string // Á að vera inni
  starfsemi: string // Ný í stað notkun, bara fyrir, birta? óstaðfest
  lysing: string // Sama og skyring. Frjáls texti, yfirleitt notkun, birta? óstaðfest
  // notkunBirting // ?

  byggingarAr: string | number
  birtStaerd: string | number

  fasteignamat: Fasteignamat
  lodarmat: number | null
  brunabotamat: number | null
}

export type Fasteign = {
  fasteignanr: string | number
  sjalfgefidStadfang: Stadfang

  // Allt hér fyrir neðan er optional
  fasteignamat?: Fasteignamat

  // Flækjum svar til að geta meðhöndlað mjög marga eigendur
  thinglystirEigendur?: Array<ThinglysturEigandi>

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
  perPage: number // Eða limit
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
