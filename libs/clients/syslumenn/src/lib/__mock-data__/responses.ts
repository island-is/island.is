import {
  Uppbod,
  VirkarHeimagistingar,
  VirkLeyfi,
  Skilabod,
  VedbandayfirlitReguverkiSvarSkeyti,
} from '../../../gen/fetch'
import { RealEstateAddress } from '../syslumennClient.types'
import { SyslumennApiPaginationInfo } from '../syslumennClient.types'

export const VHSUCCESS = [
  {
    skraningarnumer: 'string',
    heitiHeimagistingar: 'string',
    heimilisfang: 'string',
    abyrgdarmadur: 'string',
    umsoknarAr: 'string',
    sveitarfelag: 'string',
    gestafjoldi: 0,
    fjoldiHerbergja: 0,
    fastanumer: 'string',
    ibudanumer: 'string',
    postnumer: 'string',
  },
] as VirkarHeimagistingar[]

export const VHFAIL = {
  type: 'string',
  title: 'string',
  status: 0,
  detail: 'string',
  instance: 'string',
}

export const SYSLUMENN_AUCTION = [
  {
    embaetti: 'string',
    starfsstod: 'string',
    tegund: 'string',
    andlag: 'string',
    dagsetning: new Date('12.12.21'),
    klukkan: 'string',
    fastanumer: 'string',
    andlagHeiti: 'string',
    gerdarbeidendur: 'string',
    gerdartholar: 'string',
    lausafjarmunir: 'string',
  },
] as Uppbod[]

export const OPERATING_LICENSE = [
  {
    rowNum: 0,
    utgefidAf: 'string',
    leyfisnumer: 'string',
    stadur: 'string',
    kallast: 'string',
    gata: 'string',
    postnumer: 'string',
    tegund: 'string',
    gildirTil: new Date('12.12.21'),
    leyfishafi: 'string',
    flokkur: 'string',
    leyfiTilUtiveitinga: 'string',
    afgrAfgengisVirkirdagar: 'string',
    afgrAfgengisAdfaranottFridaga: 'string',
    afgrAfgengisVirkirdagarUtiveitingar: 'string',
    afgrAfgengisAdfaranottFridagaUtiveitingar: 'string',
  },
] as VirkLeyfi[]

export const OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES = {
  PageSize: 10,
  PageNumber: 1,
  TotalCount: 50,
  TotalPages: 5,
  CurrentPage: 1,
  HasNext: true,
  HasPrevious: false,
} as SyslumennApiPaginationInfo

export const OPERATING_LICENSE_SERVICE_RES = [
  {
    rowNum: 0,
    utgefidAf: 'string',
    leyfisnumer: 'string',
    stadur: 'string',
    kallast: 'string',
    gata: 'string',
    postnumer: 'string',
    tegund: 'string',
    gildirTil: new Date('12.12.21'),
    leyfishafi: 'string',
    flokkur: 'string',
    leyfi_Til_Utiveitinga: 'string',
    afgr_Afgengis_Virkirdagar: 'string',
    afgr_Afgengis_Adfaranott_Fridaga: 'string',
    afgr_Afgengis_Virkirdagar_Utiveitingar: 'string',
    afgr_Afgengis_Adfaranott_Fridaga_Utiveitingar: 'string',
  },
] as any[]

export const DATA_UPLOAD: Skilabod = {
  skilabod: 'Gögn móttekin',
  audkenni: 'string',
  malsnumer: 'string',
}

export const VEDBANDAYFIRLRIT_REGLUVERKI_RESPONSE: Array<VedbandayfirlitReguverkiSvarSkeyti> = [
  {
    fastnum: 'string',
    landNr: 123456,
    heiti: 'Hvergiland',
    svfn: 'string',
    svetiarfelag: 'string',
    notkun: 'string',
    eining: 'string',
    byggd: 'string',
    embaetti: 'string',
    embaettiNumer: 'string',
  },
]

export const REAL_ESTATE_ADDRESS: Array<RealEstateAddress> = [
  {
    address: 'Hvergiland',
  },
]
export const MORTGAGE_CERTIFICATE_CONTENT_OK = 'c29tZWNvbnRlbnQ='
export const MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING = 'Precondition Required'
export const MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING =
  'Ekki hægt að afgreiða vedbokarvottord'
