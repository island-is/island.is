export interface ApplicationSubmit {
  slysatilkynning: Slysatilkynning
}

export interface Slysatilkynning {
  tilkynnandi: TilkynnandiOrSlasadi
  slasadi: TilkynnandiOrSlasadi
  slys: Slys
  atvinnurekandi?: Atvinnurekandi | undefined
  fylgiskjol: Fylgiskjol
}

export interface TilkynnandiOrSlasadi {
  kennitala: string
  nafn: string
  stadur?: string
  postfang?: string
  netfang: string
  heimili?: string
  fyrirhvernerveridadtilkynna?: number
  simi?: string
}

export interface SlysVidVinnusjomanna {
  stadsetningskips: number
  nafnskips: string
  einkennisstafirskips: string
  nafnhafnar?: string
  heimahofnskips?: string
  skipaskrarnumer?: string
}

export interface SlysVidHeimislisstorf {
  heimili: string
  postnumer: string
  sveitarfelag: string
  nanar?: string
}

export interface Slys {
  tegund: number
  dagsetningslys: string
  timislys: string
  lysing: string
  banaslys: number
  bilslys: number
  stadurslysseferindi?: string
  lysingerindis?: number
  undirtegund?: number
  slysvidheimilisstorf?: SlysVidHeimislisstorf
  slysvidvinnusjomanna?: SlysVidVinnusjomanna
  slysvidvinnu?: Slysvidvinnu
}

export interface Slysvidvinnu {
  lysingavinnuvel: string
}

export interface Atvinnurekandi {
  fyrirtaekikennitala: string
  fyrirtaekinafn: string
  forsjaradilinafn: string
  forsjaradilinetfang: string
  forsjaradilisimi?: string
}
export interface Felagstengsl {
  kennitala: string
  nafn: string
  tegundslyss: string
}
export interface Fylgiskjol {
  fylgiskjal: Fylgiskjal[]
}
export interface Fylgiskjal {
  heiti: string
  tegund: number
  innihald: string
}

export interface EmployerEntity {
  nationalRegistrationId: string
  name: string
  email: string
  phoneNumber?: string
}
