export interface ApplicationSubmit {
  slysatilkynning: Slysatilkynning
}
export interface Slysatilkynning {
  //-xmlns:xsd: string;
  //-xmlns:xsi: string;
  tilkynnandi: TilkynnandiOrSlasadi
  slasadi: TilkynnandiOrSlasadi
  slys: Slys
  atvinnurekandi: Atvinnurekandi
  felagstengsl: Felagstengsl
  fylgiskjol: Fylgiskjol
}
export interface TilkynnandiOrSlasadi {
  kennitala: string
  nafn: string
  heimili: string
  stadur: string
  postfang: string
  netfang: string
  simi: string
}
export interface SlysVidVinnusjomanna {
  stadsetningskips: number
  nafnskips: string
  einkennisstafirskips: string
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
  tegund: string
  dagsetningslys: string
  timislys: string
  lysing: string
  banaslys: string
  bilslys: string
  stadurslysseferindi?: string
  lysingerindis?: string
  nafnhafnar?: string
  stadsetninghafnar?: string
  undirtegund?: string
  slysvidheimilisstorf?: SlysVidHeimislisstorf
  slysvidvinnusjomanna?: SlysVidVinnusjomanna
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
  tegund: string
  innihald: string
}
