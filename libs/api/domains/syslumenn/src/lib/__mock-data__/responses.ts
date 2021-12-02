import { IHomestay } from '../client/models/homestay'
import { IOperatingLicense } from '../client/models/operatingLicense'
import { ISyslumennAuction } from '../client/models/syslumennAuction'
import { DataUploadResponse } from '../models/dataUpload'

export const VHSUCCESS = [
  {
    skraningarnumer: 'string',
    heitiHeimagistingar: 'string',
    heimilisfang: 'string',
    abyrgdarmadur: 'string',
    umsoknarAr: 0,
    sveitarfelag: 'string',
    gestafjoldi: 0,
    fjoldiHerbergja: 0,
    fastanumer: 'string',
    ibudanumer: 'string',
  },
] as IHomestay[]

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
    dagsetning: 'string',
    klukkan: 'string',
    fastanumer: 'string',
    andlagHeiti: 'string',
    gerdarbeidendur: 'string',
    gerdartholar: 'string',
    lausafjarmunir: 'string',
  },
] as ISyslumennAuction[]

export const OPERATING_LICENSE = [
  {
    rowNum: 0,
    utgefidAf:"string",
    leyfisnumer:"string",
    stadur:"string",
    kallast:"string",
    gata:"string",
    postnumer:"string",
    tegund:"string",
    gildirTil:"string",
    leyfishafi:"string",
    flokkur:"string",
    leyfi_Til_Utiveitinga:"string",
    afgr_Afgengis_Virkirdagar:"string",
    afgr_Afgengis_Adfaranott_Fridaga:"string",
    afgr_Afgengis_Virkirdagar_Utiveitingar:"string",
    afgr_Afgengis_Adfaranott_Fridaga_Utiveitingar:"string"
  }
] as IOperatingLicense[]

export const DATA_UPLOAD = {
  skilabod: "string",
  audkenni: "string",
  malsnumer: "string"
} as DataUploadResponse
