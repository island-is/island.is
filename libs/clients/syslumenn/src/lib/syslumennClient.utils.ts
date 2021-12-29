import {
  Uppbod,
  VirkarHeimagistingar,
  VirkLeyfi,
  VottordSkeyti,
  EmbaettiOgStarfsstodvar,
  Skilabod,
  SyslMottakaGognPostRequest,
  AdiliTegund,
} from '../../gen/fetch'
import { uuid } from 'uuidv4'
import {
  SyslumennAuction,
  DataUploadResponse,
  Homestay,
  OperatingLicense,
  Person,
  Attachment,
  CertificateInfoResponse,
  DistrictCommissionerAgencies,
  PersonType,
} from './syslumennClient.types'
const UPLOAD_DATA_SUCCESS: string = 'Gögn móttekin'

export const mapDistrictCommissionersAgenciesResponse = (
  response: EmbaettiOgStarfsstodvar,
): DistrictCommissionerAgencies => {
  return {
    id: response.starfsstodID ?? '',
    name: response.nafn ?? '',
    place: response.stadur ?? '',
    address: response.adsetur ?? '',
  }
}

export const mapCertificateInfo = (
  response: VottordSkeyti,
): CertificateInfoResponse => {
  return {
    nationalId: response.kennitala,
    expirationDate: response.gildisTimi,
    releaseDate: response.utgafudagur,
  }
}
export const mapDataUploadResponse = (
  response: Skilabod,
): DataUploadResponse => {
  return {
    success: response.skilabod === UPLOAD_DATA_SUCCESS,
    message: response.skilabod,
    id: response.audkenni,
    caseNumber: response.malsnumer,
  }
}

export const mapHomestay = (homestay: VirkarHeimagistingar): Homestay => {
  return {
    registrationNumber: homestay.skraningarnumer ?? '',
    name: homestay.heitiHeimagistingar ?? '',
    address: homestay.heimilisfang ?? '',
    manager: homestay.abyrgdarmadur ?? '',
    year: homestay.umsoknarAr ? parseFloat(homestay.umsoknarAr) : undefined,
    city: homestay.sveitarfelag ?? '',
    guests: homestay.gestafjoldi,
    rooms: homestay.fjoldiHerbergja,
    propertyId: homestay.fastanumer ?? '',
    apartmentId: homestay.ibudanumer ?? '',
  }
}

export const mapSyslumennAuction = (auction: Uppbod): SyslumennAuction => ({
  office: auction.embaetti ?? '',
  location: auction.starfsstod ?? '',
  auctionType: auction.tegund ?? '',
  lotType: auction.andlag ?? '',
  lotName: auction.andlagHeiti ?? '',
  lotId: auction.fastanumer ?? '',
  lotItems: auction.lausafjarmunir ?? '',
  auctionDate: auction.dagsetning ? auction.dagsetning.toLocaleString() : '',
  auctionTime: auction.klukkan ?? '',
  petitioners: auction.gerdarbeidendur ?? '',
  respondent: auction.gerdartholar ?? '',
})

export const mapOperatingLicense = (
  operatingLicense: VirkLeyfi,
): OperatingLicense => ({
  id: operatingLicense.rowNum,
  issuedBy: operatingLicense.utgefidAf,
  licenseNumber: operatingLicense.leyfisnumer,
  location: operatingLicense.stadur,
  name: operatingLicense.kallast,
  street: operatingLicense.gata,
  postalCode: operatingLicense.postnumer,
  type: operatingLicense.tegund,
  validUntil: operatingLicense.gildirTil
    ? operatingLicense.gildirTil.toLocaleString()
    : '',
  licenseHolder: operatingLicense.leyfishafi,
  category: operatingLicense.flokkur,
  outdoorLicense: operatingLicense.leyfiTilUtiveitinga,
  alcoholWeekdayLicense: operatingLicense.afgrAfgengisVirkirdagar,
  alcoholWeekendLicense: operatingLicense.afgrAfgengisAdfaranottFridaga,
  alcoholWeekdayOutdoorLicense:
    operatingLicense.afgrAfgengisVirkirdagarUtiveitingar,
  alcoholWeekendOutdoorLicense:
    operatingLicense.afgrAfgengisAdfaranottFridagaUtiveitingar,
})

export function constructUploadDataObject(
  id: string,
  persons: Person[],
  attachment: Attachment,
  extraData: { [key: string]: string },
  uploadDataName: string,
  uploadDataId?: string,
): SyslMottakaGognPostRequest {
  return {
    payload: {
      audkenni: id,
      gognSkeytis: {
        audkenni: uploadDataId || uuid(),
        skeytaHeiti: uploadDataName,
        adilar: persons.map((p) => {
          return {
            id: uuid(),
            nafn: p.name,
            kennitala: p.ssn,
            simi: p.phoneNumber,
            tolvupostur: p.email,
            heimilisfang: p.homeAddress,
            postaritun: p.postalCode,
            sveitafelag: p.city,
            undirritad: p.signed,
            tegund: mapPersonEnum(p.type),
          }
        }),
        attachments: [
          { nafnSkraar: attachment.name, innihaldSkraar: attachment.content },
        ],
        gagnaMengi: extraData ?? {},
      },
    },
  }
}

function mapPersonEnum(e: PersonType) {
  switch (e) {
    case PersonType.Plaintiff:
      return AdiliTegund.NUMBER_0
    case PersonType.CounterParty:
      return AdiliTegund.NUMBER_1
    case PersonType.Child:
      return AdiliTegund.NUMBER_2
    case PersonType.CriminalRecordApplicant:
      return AdiliTegund.NUMBER_0
  }
}
