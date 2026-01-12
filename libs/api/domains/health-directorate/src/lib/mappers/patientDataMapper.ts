import {
  EuPatientConsentDto,
  EuPatientConsentStatus,
} from '@island.is/clients/health-directorate'
import { PermitStatusEnum } from '../models/enums'

import { Country } from '../models/permits/country.model'
import { Permit } from '../models/permits/permits'

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

export const mapCountryPermitStatus = (
  status: string,
): EuPatientConsentStatus => {
  switch (status) {
    case PermitStatusEnum.active:
      return EuPatientConsentStatus.ACTIVE
    case PermitStatusEnum.expired:
      return EuPatientConsentStatus.EXPIRED
    case PermitStatusEnum.inactive:
      return EuPatientConsentStatus.INACTIVE
    case PermitStatusEnum.awaitingApproval:
      return EuPatientConsentStatus.PENDING
    default:
      return EuPatientConsentStatus.INACTIVE
  }
}

export const mapPermit = (
  permit: EuPatientConsentDto,
  locale: string,
): Permit => {
  return {
    cacheId: `${permit.id}-${locale}`,
    id: permit.id ?? '',
    status: mapPermitStatus(permit.status),
    createdAt: permit.createdAt,
    validFrom: permit.validFrom,
    validTo: permit.validTo,
    codes: permit.codes ?? [],
    countries:
      permit.countries?.map((country) => {
        const countryObj: Country = {
          code: country.code,
          name: country.name,
        }
        return countryObj
      }) ?? [],
  }
}
