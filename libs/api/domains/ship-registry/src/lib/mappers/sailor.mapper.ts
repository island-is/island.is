import type {
  GetRanksResponse,
  SailorMaritimeBookDto,
  SailorRegistrationExemptionDto,
  SailorRightCertificateDto,
  SailorSchoolCertificateDto,
  SeagoingTimeResponseDto,
  CrewRegistrationDto,
  CrewRegistrationLabelsDto,
} from '@island.is/clients/ship-registry-v2'
import { LocaleEnum } from '@island.is/nest/graphql'
import { ShipRegistrySailorRightCertificate } from '../models/sailorRightCertificate.model'
import { ShipRegistrySailorSchoolCertificate } from '../models/sailorSchoolCertificate.model'
import { ShipRegistrySailorMaritimeBook } from '../models/sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from '../models/sailorRegistrationExemption.model'
import { ShipRegistrySailorSeagoingTimeCollection } from '../models/sailorSeagoingTime.model'
import { ShipRegistrySailorCrewRegistration } from '../models/sailorCrewRegistration.model'
import { ShipRegistrySailorCrewRegistrationLabel } from '../models/sailorCrewRegistrationLabel.model'
import { ShipRegistryRank } from '../models/rank.model'
import {
  ShipRegistrySailorCertificateStatus,
  ShipRegistrySailorCrewRegistrationField,
} from '../models/enums'

// --- Helpers ---

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

const mapCrewRegistration = (
  entry: CrewRegistrationDto,
  index: number,
  locale: LocaleEnum,
): ShipRegistrySailorCrewRegistration => ({
  id: `${entry.shipRegistrationNumber ?? index}-${index}-${locale}`,
  shipName: entry.shipName,
  shipRegistrationNumber: entry.shipRegistrationNumber,
  rank: locale === LocaleEnum.En ? entry.rankEn ?? entry.rank : entry.rank,
  startDate: entry.startDate,
  endDate: entry.endDate,
  numberOfDays: entry.numberOfDays,
  length: entry.length,
  grossTonnage: entry.grossTonnage,
  mainEngine: entry.mainEngine,
})

const pickLabel = (
  dto: { is: string; en: string } | undefined,
  locale: LocaleEnum,
): string => (locale === LocaleEnum.En ? dto?.en ?? '' : dto?.is ?? '')

const mapCrewRegistrationLabels = (
  labels: CrewRegistrationLabelsDto,
  locale: LocaleEnum,
): ShipRegistrySailorCrewRegistrationLabel[] => [
  {
    entryField: ShipRegistrySailorCrewRegistrationField.SHIP_NAME,
    label: pickLabel(labels.shipName, locale),
  },
  {
    entryField: ShipRegistrySailorCrewRegistrationField.LENGTH,
    label: pickLabel(labels.length, locale),
  },
  {
    entryField: ShipRegistrySailorCrewRegistrationField.GROSS_TONNAGE,
    label: pickLabel(labels.grossTonnage, locale),
  },
  {
    entryField: ShipRegistrySailorCrewRegistrationField.MAIN_ENGINE,
    label: pickLabel(labels.mainEngine, locale),
  },
  {
    entryField:
      ShipRegistrySailorCrewRegistrationField.SHIP_REGISTRATION_NUMBER,
    label: pickLabel(labels.shipRegistrationNo, locale),
  },
  {
    entryField: ShipRegistrySailorCrewRegistrationField.RANK,
    label: pickLabel(labels.rankNameAndCode, locale),
  },
  {
    entryField: ShipRegistrySailorCrewRegistrationField.START_DATE,
    label: pickLabel(labels.startDate, locale),
  },
  {
    entryField: ShipRegistrySailorCrewRegistrationField.END_DATE,
    label: pickLabel(labels.endDate, locale),
  },
  {
    entryField: ShipRegistrySailorCrewRegistrationField.NUMBER_OF_DAYS,
    label: pickLabel(labels.numberOfDays, locale),
  },
]

// --- Mappers ---

export const mapToSailorSchoolCertificates = (
  entries: SailorSchoolCertificateDto[],
  locale: LocaleEnum,
): ShipRegistrySailorSchoolCertificate[] =>
  entries.map((cert) => ({
    ...cert,
    id: `${cert.id}-${locale}`,
    status: mapSailorCertificateStatus(cert.status),
  }))

export const mapToSailorRightCertificates = (
  entries: SailorRightCertificateDto[],
  locale: LocaleEnum,
): ShipRegistrySailorRightCertificate[] =>
  entries.map((cert) => ({
    ...cert,
    id: `${cert.id}-${locale}`,
    status: mapSailorCertificateStatus(cert.status),
  }))

export const mapToSailorMaritimeBooks = (
  entries: SailorMaritimeBookDto[],
  locale: LocaleEnum,
): ShipRegistrySailorMaritimeBook[] =>
  entries.map((book) => ({
    ...book,
    id: `${book.id}-${locale}`,
  }))

export const mapToSailorRegistrationExemptions = (
  entries: SailorRegistrationExemptionDto[],
  locale: LocaleEnum,
): ShipRegistrySailorRegistrationExemption[] =>
  entries.map((exemption) => ({
    ...exemption,
    id: `${exemption.id}-${locale}`,
  }))

export const mapToSailorSeagoingTime = (
  response: SeagoingTimeResponseDto,
  locale: LocaleEnum,
): ShipRegistrySailorSeagoingTimeCollection => ({
  data: response.entries.map((entry, index) =>
    mapCrewRegistration(entry, index, locale),
  ),
  totalCount: response.totalCount,
  pageInfo: { hasNextPage: response.hasNextPage },
  totalCrewRegistrationDayCount: response.totalCrewRegistrationDayCount,
  seaServiceDayCount: response.seaServiceDayCount,
  workAshoreDayCount: response.workAshoreDayCount,
  totalWorkDays: response.totalWorkDays,
  valueLabels: response.header
    ? mapCrewRegistrationLabels(response.header, locale)
    : [],
})

export const mapToRanks = (
  dtos: GetRanksResponse,
  locale: LocaleEnum,
): ShipRegistryRank[] =>
  dtos.map((rank) => ({
    id: String(rank.rank_id),
    name: locale === LocaleEnum.En ? rank.rank_en : rank.rank,
  }))
