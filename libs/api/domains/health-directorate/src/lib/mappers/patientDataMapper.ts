import {
  ConsentHistoryEntryDto,
  EuPatientConsentDto,
  EuPatientConsentStatus,
} from '@island.is/clients/health-directorate'
import { PermitStatusEnum } from '../models/enums'

import { Country } from '../models/permits/country.model'
import { Permit, PermitHistoryEntry } from '../models/permits/permits'

export const mapPermitStatus = (
  status: EuPatientConsentStatus,
): PermitStatusEnum => {
  switch (status) {
    case EuPatientConsentStatus.ACTIVE:
      return PermitStatusEnum.active
    case EuPatientConsentStatus.EXPIRED:
      return PermitStatusEnum.expired
    case EuPatientConsentStatus.INACTIVE:
      return PermitStatusEnum.inactive
    case EuPatientConsentStatus.PENDING:
      return PermitStatusEnum.awaitingApproval
    default:
      return PermitStatusEnum.unknown
  }
}

const mapCountries = (
  countries: Array<{ code: string; name: string }>,
): Country[] =>
  countries.map((country) => ({ code: country.code, name: country.name }))

export const mapPermit = (
  permit: EuPatientConsentDto,
  locale: string,
): Permit => {
  return {
    cacheId: `${permit.id ?? 'no-id'}-${locale}`,
    id: permit.id,
    status: mapPermitStatus(permit.status),
    createdAt: permit.createdAt,
    validFrom: permit.validFrom,
    validTo: permit.validTo,
    codes: permit.codes ?? [],
    countries: mapCountries(permit.countries ?? []),
  }
}

export const mapPermitHistoryEntry = (
  entry: ConsentHistoryEntryDto,
): PermitHistoryEntry => {
  return {
    countries: mapCountries(entry.countries ?? []),
    consentTypes: entry.consentTypes ?? [],
    validFrom: entry.validFrom,
    validTo: entry.validTo,
    changedAt: entry.changedAt,
    createdAt: entry.createdAt,
  }
}
