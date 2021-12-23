import {
  Uppbod,
  VirkarHeimagistingar,
  VirkLeyfi,
  Skilabod,
} from '../../../gen/fetch'

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
  skilabod: 'string',
  audkenni: 'string',
  malsnumer: 'string',
}
