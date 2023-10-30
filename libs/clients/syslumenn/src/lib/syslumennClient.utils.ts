import {
  Uppbod,
  VirkarHeimagistingar,
  VirkLeyfi,
  VottordSkeyti,
  EmbaettiOgStarfsstodvar,
  Skilabod,
  SyslMottakaGognPostRequest,
  AdiliTegund,
  VedbandayfirlitReguverkiSvarSkeyti,
  SkraningaradiliDanarbusSkeyti,
  TegundAndlags,
  DanarbuUppl,
  EignirDanarbus,
  Fasteignasalar,
  Logmenn,
  Afengisleyfi,
  Taekifaerisleyfi,
  Verdbrefamidlari,
  Erfingar,
  Malsvari,
  Meistaraleyfi,
} from '../../gen/fetch'
import { uuid } from 'uuidv4'
import {
  AlcoholLicence,
  SyslumennAuction,
  DataUploadResponse,
  Homestay,
  OperatingLicense,
  PaginatedOperatingLicenses,
  PaginationInfo,
  SyslumennApiPaginationInfo,
  Person,
  Attachment,
  CertificateInfoResponse,
  DistrictCommissionerAgencies,
  PersonType,
  AssetName,
  EstateMember,
  EstateAsset,
  EstateRegistrant,
  EstateInfo,
  RealEstateAgent,
  Lawyer,
  OperatingLicensesCSV,
  TemporaryEventLicence,
  Broker,
  Advocate,
  MasterLicence,
} from './syslumennClient.types'
const UPLOAD_DATA_SUCCESS = 'Gögn móttekin'

export const cleanPropertyNumber = (propertyNumber: string): string => {
  const firstChar = propertyNumber.charAt(0).toUpperCase()
  return firstChar === 'F' || firstChar === 'L'
    ? propertyNumber.substring(1, propertyNumber.length)
    : propertyNumber
}

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
    year: homestay.umsoknarAr ? parseInt(homestay.umsoknarAr) : undefined,
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
  lotType: auction?.andlag?.trim() ?? '',
  lotName: auction.andlagHeiti ?? '',
  lotId: auction.fastanumer ?? '',
  lotItems: auction.lausafjarmunir ?? '',
  auctionDate: auction.dagsetning ? auction.dagsetning.toLocaleString() : '',
  auctionTime: auction.klukkan ?? '',
  petitioners: auction.gerdarbeidendur ?? '',
  respondent: auction.gerdartholar ?? '',
  publishText: auction.auglysingatexti ?? '',
  auctionTakesPlaceAt: auction.uppbodStadur ?? '',
})

export const mapRealEstateAgent = (agent: Fasteignasalar): RealEstateAgent => ({
  name: agent.nafn?.trim() ?? '',
  location: agent.starfsstod?.trim() ?? '',
})

export const mapLawyer = (lawyer: Logmenn): Lawyer => ({
  name: lawyer.nafn?.trim() ?? '',
  licenceType: lawyer.tegundRettinda?.trim() ?? '',
})

export const mapBroker = (broker: Verdbrefamidlari): Broker => ({
  name: broker.nafn?.trim() ?? '',
  nationalId: broker.kennitala?.trim() ?? '',
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
  type2: operatingLicense.tegund2,
  restaurantType: operatingLicense.tegundVeitingastadar,
  validFrom: operatingLicense.gildirFra,
  validTo: operatingLicense.gildirTil,
  licenseHolder: operatingLicense.leyfishafi,
  licenseResponsible: operatingLicense.abyrgdarmadur,
  category: operatingLicense.flokkur,
  outdoorLicense: operatingLicense.leyfiTilUtiveitinga,
  alcoholWeekdayLicense: operatingLicense.afgrAfgengisVirkirdagar,
  alcoholWeekendLicense: operatingLicense.afgrAfgengisAdfaranottFridaga,
  alcoholWeekdayOutdoorLicense:
    operatingLicense.afgrAfgengisVirkirdagarUtiveitingar,
  alcoholWeekendOutdoorLicense:
    operatingLicense.afgrAfgengisAdfaranottFridagaUtiveitingar,
  maximumNumberOfGuests: operatingLicense.hamarksfjoldiGesta,
  numberOfDiningGuests: operatingLicense.fjoldiGestaIVeitingum,
})

export const mapPaginationInfo = (
  paginationInfoHeaderJSON: string,
): PaginationInfo => {
  const paginationInfoFromHeader: SyslumennApiPaginationInfo = JSON.parse(
    paginationInfoHeaderJSON,
  )
  return {
    pageSize: paginationInfoFromHeader.PageSize,
    pageNumber: paginationInfoFromHeader.PageNumber,
    totalCount: paginationInfoFromHeader.TotalCount,
    totalPages: paginationInfoFromHeader.TotalPages,
    currentPage: paginationInfoFromHeader.CurrentPage,
    hasNext: paginationInfoFromHeader.HasNext,
    hasPrevious: paginationInfoFromHeader.HasPrevious,
  }
}

export const mapPaginatedOperatingLicenses = (
  searchQuery: string,
  paginationInfoHeaderJSON: string,
  results: VirkLeyfi[],
): PaginatedOperatingLicenses => ({
  paginationInfo: mapPaginationInfo(paginationInfoHeaderJSON),
  searchQuery: searchQuery,
  results: (results ?? []).map(mapOperatingLicense),
})

export const mapOperatingLicensesCSV = (
  responseStringCSV: string,
): OperatingLicensesCSV => ({
  value: responseStringCSV,
})

export const mapAlcoholLicence = (
  alcoholLicence: Afengisleyfi,
): AlcoholLicence => ({
  licenceType: alcoholLicence.tegund?.trim() ?? '',
  licenceSubType: alcoholLicence.tegundLeyfis?.trim() ?? '',
  licenseNumber: alcoholLicence.leyfisnumer?.trim() ?? '',
  issuedBy: alcoholLicence.utgefidAf?.trim() ?? '',
  year: alcoholLicence.skraningarAr
    ? parseInt(alcoholLicence.skraningarAr)
    : undefined,
  validFrom: alcoholLicence.gildirFra ? alcoholLicence.gildirFra : undefined,
  validTo: alcoholLicence.gildirTil ? alcoholLicence.gildirTil : undefined,
  licenseHolder: alcoholLicence.leyfishafi?.trim() ?? '',
  licenseResponsible: alcoholLicence.abyrgdarmadur?.trim() ?? '',
  office: alcoholLicence.embaetti?.trim() ?? '',
  location: alcoholLicence.starfsstodEmbaettis?.trim() ?? '',
})

export const mapTemporaryEventLicence = (
  temporaryEventLicence: Taekifaerisleyfi,
): TemporaryEventLicence => ({
  licenceType: temporaryEventLicence.tegund?.trim() ?? '',
  licenceSubType: temporaryEventLicence.tegundLeyfis?.trim() ?? '',
  licenseNumber: temporaryEventLicence.leyfisnumer?.trim() ?? '',
  issuedBy: temporaryEventLicence.utgefidAf?.trim() ?? '',
  year: temporaryEventLicence.skraningarAr
    ? parseInt(temporaryEventLicence.skraningarAr)
    : undefined,
  validFrom: temporaryEventLicence.gildirFra
    ? temporaryEventLicence.gildirFra
    : undefined,
  validTo: temporaryEventLicence.gildirTil
    ? temporaryEventLicence.gildirTil
    : undefined,
  licenseHolder: temporaryEventLicence.leyfishafi?.trim() ?? '',
  licenseResponsible: temporaryEventLicence.abyrgdarmadur?.trim() ?? '',
  maximumNumberOfGuests: temporaryEventLicence.hamarksfjoldi,
  estimatedNumberOfGuests: temporaryEventLicence.aaetladurFjoldi,
})

export function constructUploadDataObject(
  id: string,
  persons: Person[],
  attachments: Attachment[] | undefined,
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
        attachments: attachments?.map((attachment) => ({
          nafnSkraar: attachment.name,
          innihaldSkraar: attachment.content,
        })),

        gagnaMengi: extraData ?? {},
      },
    },
  }
}

function mapAdvocate(advocateRaw: Malsvari): Advocate {
  return {
    address: advocateRaw.heimilisfang ?? '',
    email: advocateRaw.netfang ?? '',
    name: advocateRaw.nafn ?? '',
    nationalId: advocateRaw.kennitala ?? '',
    phone: advocateRaw.simi ?? '',
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
    case PersonType.MortgageCertificateApplicant:
      return AdiliTegund.NUMBER_0
    case PersonType.AnnouncerOfDeathCertificate:
      return AdiliTegund.NUMBER_0
  }
}

export const mapAssetName = (
  response: VedbandayfirlitReguverkiSvarSkeyti,
): AssetName => {
  return { name: response.heiti ?? '' }
}

export const estateMemberMapper = (estateRaw: Erfingar): EstateMember => {
  return {
    name: estateRaw.nafn ?? '',
    nationalId: estateRaw.kennitala ?? '',
    relation: estateRaw.tengsl ?? 'Annað',
    advocate: estateRaw.malsvari ? mapAdvocate(estateRaw.malsvari) : undefined,
  }
}

export const assetMapper = (assetRaw: EignirDanarbus): EstateAsset => {
  return {
    description: assetRaw.lysing ?? '',
    assetNumber: assetRaw.fastanumer ?? '',
    share: assetRaw.eignarhlutfall ?? 1,
  }
}

export const mapEstateRegistrant = (
  syslaData: SkraningaradiliDanarbusSkeyti,
): EstateRegistrant => {
  return {
    applicantEmail: syslaData.tolvuposturSkreningaradila ?? '',
    applicantPhone: syslaData.simiSkraningaradila ?? '',
    knowledgeOfOtherWills: syslaData.vitneskjaUmAdraErfdaskra ? 'Yes' : 'No',
    districtCommissionerHasWill: syslaData.erfdaskraIVorsluSyslumanns ?? false,
    assets: syslaData.eignir
      ? syslaData.eignir
          .filter(
            (a) =>
              a.tegundAngalgs === TegundAndlags.NUMBER_0 &&
              a?.fastanumer &&
              /^[fF]{0,1}\d{7}$/.test(a.fastanumer),
          )
          .map(assetMapper)
      : [],
    vehicles: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_1)
          .map(assetMapper)
      : [],
    ships: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_2)
          .map(assetMapper)
      : [],
    cash: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_3)
          .map(assetMapper)
      : [],
    flyers: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_4)
          .map(assetMapper)
      : [],
    guns: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_10)
          .map(assetMapper)
      : [],
    estateMembers: syslaData.adilarDanarbus
      ? syslaData.adilarDanarbus.map(estateMemberMapper)
      : [],
    marriageSettlement: syslaData.kaupmaili ?? false,
    office: syslaData.embaetti ?? '',
    caseNumber: syslaData.malsnumer ?? '',
    dateOfDeath: syslaData.danardagur ?? '',
    nameOfDeceased: syslaData.nafnLatins ?? '',
    nationalIdOfDeceased: syslaData.kennitalaLatins ?? '',
    ownBusinessManagement: syslaData.eiginRekstur ?? false,
    assetsAbroad: syslaData.eignirErlendis ?? false,
    occupationRightViaCondominium:
      syslaData.buseturetturVegnaKaupleiguIbuda ?? false,
    bankStockOrShares: syslaData.bankareikningarVerdbrefEdaHlutabref ?? false,
  }
}

// TODO: get updated types into the client
export const mapEstateInfo = (syslaData: DanarbuUppl): EstateInfo => {
  return {
    assets: syslaData.eignir
      ? syslaData.eignir
          .filter(
            (a) =>
              a.tegundAngalgs === TegundAndlags.NUMBER_0 &&
              a?.tegundAngalgs &&
              /^[fF]{0,1}\d{7}$/.test(a.fastanumer ?? ''),
          )
          .map(assetMapper)
      : [],
    vehicles: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_1)
          .map(assetMapper)
      : [],
    ships: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_2)
          .map(assetMapper)
      : [],
    cash: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_3)
          .map(assetMapper)
      : [],
    flyers: syslaData.eignir
      ? syslaData.eignir
          .filter((a) => a.tegundAngalgs === TegundAndlags.NUMBER_4)
          .map(assetMapper)
      : [],
    // TODO: update once implemented in District Commissioner's backend
    guns: [],
    estateMembers: syslaData.erfingar
      ? syslaData.erfingar.map(estateMemberMapper)
      : [],
    addressOfDeceased: syslaData?.logheimili ?? '',
    caseNumber: syslaData?.malsnumer ?? '',
    dateOfDeath: syslaData?.danardagur
      ? new Date(syslaData.danardagur)
      : new Date(),
    districtCommissionerHasWill: Boolean(syslaData?.erfdaskra),
    knowledgeOfOtherWills: syslaData.erfdakraVitneskja ? 'Yes' : 'No',
    marriageSettlement: syslaData.kaupmali,
    nameOfDeceased: syslaData?.nafn ?? '',
    nationalIdOfDeceased: syslaData?.kennitala ?? '',
  }
}
export const mapMasterLicence = (licence: Meistaraleyfi): MasterLicence => {
  return {
    name: licence.nafn,
    dateOfPublication: licence.gildirFra,
    profession: licence.idngrein,
    office: licence.embaetti,
  }
}
