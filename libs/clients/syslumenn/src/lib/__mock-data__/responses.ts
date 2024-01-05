import {
  Uppbod,
  VirkarHeimagistingar,
  VirkLeyfi,
  Skilabod,
  VedbandayfirlitReguverkiSvarSkeyti,
  SkraningaradiliDanarbusSkeyti,
  Fasteignasalar,
  Logmenn,
  Afengisleyfi,
  Taekifaerisleyfi,
  Verdbrefamidlari,
} from '../../../gen/fetch'
import { AssetName, SyslumennApiPaginationInfo } from '../syslumennClient.types'

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
    auglysingatexti: 'string',
    lausafjarmunir: 'string',
  },
] as Uppbod[]

export const REAL_ESTATE_AGENTS = [
  {
    nafn: 'string',
    starfsstod: 'string',
  },
] as Fasteignasalar[]

export const LAWYERS = [
  {
    nafn: 'string',
    tegundRettinda: 'string',
  },
] as Logmenn[]

export const BROKERS = [
  {
    nafn: 'string',
    kennitala: 'string',
  },
] as Verdbrefamidlari[]

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

export const OPERATING_LICENSES_CSV = 'a,b\r\nx,y\r\nz,i'

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
] as any[] // This return object has no type, see clientConfig.json

export const ALCOHOL_LICENCES = [
  {
    tegund: 'string',
    tegundLeyfis: 'string',
    leyfisnumer: 'string',
    utgefidAf: 'string',
    skraningarAr: '2021',
    gildirFra: new Date('2022-05-01'),
    gildirTil: new Date('2023-05-01'),
    leyfishafi: 'string',
    abyrgdarmadur: 'string',
    embaetti: 'string',
    starfsstodEmbaettis: 'string',
  },
] as Afengisleyfi[]

export const TEMPORARY_EVENT_LICENCES = [
  {
    tegund: 'string',
    tegundLeyfis: 'string',
    leyfisnumer: 'string',
    utgefidAf: 'string',
    skraningarAr: '2021',
    gildirFra: new Date('2022-05-01'),
    gildirTil: new Date('2023-05-01'),
    leyfishafi: 'string',
    abyrgdarmadur: 'string',
    hamarksfjoldi: 0,
    aaetladurFjoldi: 0,
  },
] as Taekifaerisleyfi[]

export const DATA_UPLOAD: Skilabod = {
  skilabod: 'Gögn móttekin',
  audkenni: 'string',
  malsnumer: 'string',
}

export const VEDBANDAYFIRLRIT_REGLUVERKI_RESPONSE: Array<VedbandayfirlitReguverkiSvarSkeyti> =
  [
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

export const ESTATE_REGISTRANT_RESPONSE: Array<SkraningaradiliDanarbusSkeyti> =
  [
    {
      eignir: [
        {
          lysing: 'Húsið 1',
          fastanumer: '2010005',
          tegundAngalgs: 0,
          eignarhlutfall: 0.5,
        },
        {
          lysing: 'Nissan Terrano II',
          fastanumer: 'VA334',
          tegundAngalgs: 1,
          eignarhlutfall: 0.5,
        },
      ],
      embaetti: 'Sýslumaðurinn á höfuðborgarsvæðinu',
      kaupmaili: false,
      malsnumer: '2020-000123',
      danardagur: new Date('2023-04-29T14:02:59.332Z'),
      nafnLatins: 'Gervimaður Ameríku',
      eiginRekstur: false,
      adilarDanarbus: [
        {
          nafn: 'Gervimaður Færeyja',
          kennitala: '0101302399',
          tegundTengsla: 'Maki',
        },
        {
          nafn: 'Gervimaður Bretland',
          kennitala: '0101304929',
          tegundTengsla: 'Faðir',
        },
      ],
      eignirErlendis: false,
      kennitalaLatins: '0101302989',
      simiSkraningaradila: '5005000',
      kennitalaSkreningaradila: '0101302399',
      vitneskjaUmAdraErfdaskra: false,
      erfdaskraIVorsluSyslumanns: false,
      tolvuposturSkreningaradila: 'adili@postur.is',
      buseturetturVegnaKaupleiguIbuda: false,
      bankareikningarVerdbrefEdaHlutabref: false,
    },
  ]

export const MORTGAGE_CERTIFICATE_CONTENT_OK = 'c29tZWNvbnRlbnQ='
export const MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING = 'Precondition Required'
export const MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING =
  'Ekki hægt að afgreiða vedbokarvottord'

export const REAL_ESTATE_ADDRESS_NAME = 'Hvergiland'

export const REAL_ESTATE_ADDRESS: Array<AssetName> = [
  {
    name: REAL_ESTATE_ADDRESS_NAME,
  },
]
