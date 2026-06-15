import {
  RankDto,
  SailorMaritimeBookDto,
  SailorRegistrationExemptionDto,
  SailorRightCertificateDto,
  SailorSchoolCertificateDto,
  SailorSeaServiceResponseDto,
  ShipBaseInfoDto,
  ShipCertificateIssueStatus,
  ShipDetailDto,
  ValueMessageDto,
  ValueUnitMessageDto,
} from '@island.is/clients/ship-registry-v2'
import { isDefined } from '@island.is/shared/utils'
import { UserShipCollectionItem } from './models/userShipCollectionItem.model'
import { UserShip } from './models/userShip.model'
import { ShipRegistryLocalizedValue } from './models/localizedValue.model'
import {
  ShipRegistryCertificateStatus,
  ShipRegistrySailorCertificateStatus,
} from './models/enums'
import { ShipRegistrySailorRightCertificate } from './models/sailorRightCertificate.model'
import { ShipRegistrySailorSchoolCertificate } from './models/sailorSchoolCertificate.model'
import { ShipRegistrySailorMaritimeBook } from './models/sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from './models/sailorRegistrationExemption.model'
import { ShipRegistrySailorSeaServiceBookEntry } from './models/sailorSeaServiceBookEntry.model'
import { ShipRegistrySailorSeaServiceBookCollection } from './models/sailorSeaServiceBookCollection.model'
import { ShipRegistryRank } from './models/rank.model'
import format from 'date-fns/format'
import { LocaleEnum } from '@island.is/nest/graphql'

const mapCertificateStatus = (
  raw: ShipCertificateIssueStatus | undefined,
): ShipRegistryCertificateStatus => {
  switch (raw) {
    case 'VALID':
      return ShipRegistryCertificateStatus.Valid
    case 'INVALID':
      return ShipRegistryCertificateStatus.Invalid
    case 'NEEDS_REINSPECTION':
      return ShipRegistryCertificateStatus.ReinspectionNeeded
    case 'IN_INSPECTION_WINDOW':
      return ShipRegistryCertificateStatus.InInspectionWindow
    default:
      return ShipRegistryCertificateStatus.Unknown
  }
}

const mapSailorCertificateStatus = (
  raw: string | undefined,
): ShipRegistrySailorCertificateStatus => {
  switch (raw) {
    case 'Valid':
      return ShipRegistrySailorCertificateStatus.Valid
    case 'Invalid':
      return ShipRegistrySailorCertificateStatus.Invalid
    default:
      return ShipRegistrySailorCertificateStatus.Unknown
  }
}

const toLocalizedValue = (
  dto: ValueMessageDto | ValueUnitMessageDto | undefined,
  locale: LocaleEnum,
): ShipRegistryLocalizedValue | undefined => {
  if (!dto) return undefined
  return {
    label: locale === LocaleEnum.En ? dto.translation.en : dto.translation.is,
    value: dto.value ?? undefined,
    unit: 'unit' in dto ? dto.unit ?? undefined : undefined,
  }
}

export const mapToUserShipCollection = (
  ships: ShipBaseInfoDto[],
): UserShipCollectionItem[] => {
  return ships.map(mapToUserShipCollectionItem).filter(isDefined)
}

export const mapToUserShipCollectionItem = (
  ship: ShipBaseInfoDto,
): UserShipCollectionItem | undefined => {
  if (!ship.shipRegistrationNumber || !ship.shipName) {
    return undefined
  }

  const validTo = ship.seaWorthyExpiry ?? undefined

  return {
    registrationNumber: Number(ship.shipRegistrationNumber),
    name: ship.shipName,
    regionAcronym: ship.regionalAcronym ?? undefined,
    seaworthiness: validTo
      ? {
          isValid: validTo >= new Date(),
          validTo,
        }
      : undefined,
  }
}

export const mapToUserShipFromDetails = (
  ship: ShipDetailDto,
  locale: LocaleEnum = LocaleEnum.Is,
): UserShip | undefined => {
  const info = ship.shipRegistrationInfo
  const spec = ship.shipSpec

  if (!info?.shipRegistrationNumber?.value || !info?.shipName?.value) {
    return undefined
  }

  const registrationNumber = Number(info.shipRegistrationNumber.value)

  const seaworthinessDate = info.seaworthyExpiryDateParsed

  const fisheryName = toLocalizedValue(info.fishery, locale)

  return {
    id: `${registrationNumber}-${locale}`,
    registrationNumber,
    name: info.shipName.value,
    region: toLocalizedValue(info.regionString, locale),
    usageType: toLocalizedValue(info.usageTypeString, locale),
    imoNumber: toLocalizedValue(info.imoNumber, locale),
    constructionYear: toLocalizedValue(info.constructionYear, locale),
    constructionStation: toLocalizedValue(info.constructionStation, locale),
    hullMaterial: toLocalizedValue(info.hullMaterial, locale),
    classificationSociety: toLocalizedValue(info.classificationSociety, locale),
    phoneOnBoard: toLocalizedValue(info.phoneOnBoardShip, locale),
    isSeaworthy: seaworthinessDate != null && seaworthinessDate >= new Date(),
    seaworthinessCertificateValidTo: toLocalizedValue(
      seaworthinessDate
        ? {
            translation: info.seaworthyExpiryDate.translation,
            value: format(seaworthinessDate, 'dd.MM.yyyy'),
          }
        : undefined,
      locale,
    ),
    measurements: (() => {
      if (!spec) return undefined
      const m = {
        length: toLocalizedValue(spec.length, locale),
        maxLength: toLocalizedValue(spec.maxLength, locale),
        width: toLocalizedValue(spec.width, locale),
        depth: toLocalizedValue(spec.depth, locale),
        bruttoGrossTonnage: toLocalizedValue(spec.bruttoGRT, locale),
        bruttoWeight: toLocalizedValue(spec.bruttoTonnage, locale),
      }
      return Object.values(m).some(Boolean) ? m : undefined
    })(),
    fishery: fisheryName
      ? {
          name: fisheryName,
          address: toLocalizedValue(info.fisheryAddress, locale),
          municipality: toLocalizedValue(info.fisheryMunicipality, locale),
          phoneNumber: toLocalizedValue(info.fisheryPhoneNo, locale),
        }
      : undefined,
    engines: ship.mainEngines
      ?.map((engine) => {
        const name = toLocalizedValue(engine.engineName, locale)
        if (!name) return undefined
        return {
          name,
          year: toLocalizedValue(engine.engineYear, locale),
          power: toLocalizedValue(engine.enginePower, locale),
        }
      })
      .filter(isDefined),
    certificates: ship.shipCertificateDetails.map((cert) => ({
      name: cert.certificateTypeName,
      status: mapCertificateStatus(cert.certificateIssueStatusEnum),
      issueDate: cert.issueDate,
      validToDate: cert.validToDate,
      extensionDate: cert.extensionDate,
    })),
  }
}

export const mapToSailorSchoolCertificates = (
  entries: SailorSchoolCertificateDto[],
  locale: LocaleEnum,
): ShipRegistrySailorSchoolCertificate[] =>
  entries.map((c) => ({
    ...c,
    id: `${c.id}-${locale}`,
    status: mapSailorCertificateStatus(c.status),
  }))

export const mapToSailorRightCertificates = (
  entries: SailorRightCertificateDto[],
  locale: LocaleEnum,
): ShipRegistrySailorRightCertificate[] =>
  entries.map((c) => ({
    ...c,
    id: `${c.id}-${locale}`,
    status: mapSailorCertificateStatus(c.status),
  }))

export const mapToSailorMaritimeBooks = (
  entries: SailorMaritimeBookDto[],
  locale: LocaleEnum,
): ShipRegistrySailorMaritimeBook[] =>
  entries.map((b) => ({
    ...b,
    id: `${b.id}-${locale}`,
  }))

export const mapToSailorRegistrationExemptions = (
  entries: SailorRegistrationExemptionDto[],
  locale: LocaleEnum,
): ShipRegistrySailorRegistrationExemption[] =>
  entries.map((e) => ({
    ...e,
    id: `${e.id}-${locale}`,
  }))

const mapSeaServiceEntry = (
  e: { shipName?: string; shipRegistrationNumber?: string; rank?: string; rankEn?: string; startDate?: Date; endDate?: Date; numberOfDays?: number },
  i: number,
  locale: LocaleEnum,
): ShipRegistrySailorSeaServiceBookEntry => ({
  id: `${e.shipRegistrationNumber ?? i}-${i}-${locale}`,
  shipName: e.shipName,
  shipRegistrationNumber: e.shipRegistrationNumber,
  rank: locale === LocaleEnum.En ? (e.rankEn ?? e.rank) : e.rank,
  startDate: e.startDate,
  endDate: e.endDate,
  numberOfDays: e.numberOfDays,
})

export const mapToSailorSeaServiceBookCollection = (
  response: SailorSeaServiceResponseDto,
  locale: LocaleEnum,
): ShipRegistrySailorSeaServiceBookCollection => ({
  data: response.entries.map((e, i) => mapSeaServiceEntry(e, i, locale)),
  totalCount: response.totalCount,
  pageInfo: { hasNextPage: response.hasNextPage },
  totalCrewRegistrationDayCount: response.totalCrewRegistrationDayCount,
  seaServiceDayCount: response.seaServiceDayCount,
  workAshoreDayCount: response.workAshoreDayCount,
  totalWorkDays: response.totalWorkDays,
})

export const mapToRanks = (
  dtos: RankDto[],
  locale: LocaleEnum,
): ShipRegistryRank[] =>
  dtos.map((dto) => ({
    id: String(dto.ID),
    name: locale === LocaleEnum.En ? dto.RANK_EN : dto.RANK,
  }))
