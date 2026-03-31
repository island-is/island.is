import {
  MyShipDetailDto,
  ShipBaseInfoDto,
  ShipCertificateDetailDto,
  ValueMessageDto,
  ValueUnitMessageDto,
} from '@island.is/clients/ship-registry-v2'
import { isDefined } from '@island.is/shared/utils'
import { UserShipCollectionItem } from './models/userShipCollectionItem.model'
import { UserShip } from './models/userShip.model'
import { ShipRegistryLocalizedValue } from './models/localizedValue.model'
import { LocaleEnum } from './dto/locale.enum'
import { ShipRegistryCertificateStatus } from './models/enums'
import { parseDate } from './utils'
import format from 'date-fns/format'

const mapCertificateStatus = (
  raw: ShipCertificateDetailDto['certificateIssueStatusEnum'] | undefined,
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

  const validTo = ship.seaWorthyExpiry
    ? new Date(ship.seaWorthyExpiry)
    : undefined

  return {
    id: ship.shipRegistrationNumber,
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
  ship: MyShipDetailDto,
  locale: LocaleEnum = LocaleEnum.Is,
): UserShip | undefined => {
  const info = ship.shipRegistrationInfo
  const spec = ship.shipSpec

  if (!info?.shipRegistrationNumber?.value || !info?.shipName?.value) {
    return undefined
  }

  const registrationNumber = Number(info.shipRegistrationNumber.value)

  const seaworthinessDate =
    info.seaworthyExpiryDate?.value && info.seaworthyExpiryDate?.value !== '-'
      ? new Date(info.seaworthyExpiryDate.value)
      : undefined

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
    isSeaworthy: info.seaworthyExpiryDate?.value !== '-',
    seaworthinessCertificateValidTo: toLocalizedValue(
      seaworthinessDate
        ? {
            translation: info.seaworthyExpiryDate.translation,
            value: format(seaworthinessDate, 'dd.MM.yyyy'),
          }
        : undefined,
      locale,
    ),
    measurements: spec
      ? {
          length: toLocalizedValue(spec.length, locale),
          maxLength: toLocalizedValue(spec.maxLength, locale),
          width: toLocalizedValue(spec.width, locale),
          depth: toLocalizedValue(spec.depth, locale),
          bruttoGrossTonnage: toLocalizedValue(spec.bruttoGRT, locale),
          bruttoWeight: toLocalizedValue(spec.bruttoTonnage, locale),
        }
      : undefined,
    fishery: info.fishery?.value
      ? {
          name: toLocalizedValue(info.fishery, locale),
          address: toLocalizedValue(info.fisheryAddress, locale),
          municipality: toLocalizedValue(info.fisheryMunicipality, locale),
          phoneNumber: toLocalizedValue(info.fisheryPhoneNo, locale),
        }
      : undefined,
    engines: ship.mainEngines?.map((engine) => ({
      name: toLocalizedValue(engine.engineName, locale),
      year: toLocalizedValue(engine.engineYear, locale),
      power: toLocalizedValue(engine.enginePower, locale),
    })),
    certificates: ship.shipCertificateDetails
      ?.map((cert) => {
        if (!cert.issueDate) return undefined
        return {
          name: cert.certificateTypeName,
          status: mapCertificateStatus(cert.certificateIssueStatusEnum),
          issueDate: parseDate(cert.issueDate),
          validToDate:
            cert.validToDate !== '' ? parseDate(cert.validToDate) : undefined,
          extensionDate: cert.extensionDate
            ? parseDate(cert.extensionDate)
            : undefined,
        }
      })
      .filter(isDefined),
  }
}
