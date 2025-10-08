import { type Locale } from '@island.is/shared/types'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { License } from '../models/license.model'
import { addLicenseTypePrefix } from '../utils'
import { LicenseType } from '../models/licenseType.model'
import { Status } from '../models/licenseStatus.model'
import { HealthDirectorateLicenseToPractice } from '@island.is/clients/health-directorate'
import { isDefined } from '@island.is/shared/utils'

export const mapHealthDirectorateLicensesResponse = (
  licenses: HealthDirectorateLicenseToPractice[],
  locale: Locale,
): Array<License> => {
  return (
    licenses
      ?.map((l) => mapHealthDirectorateLicense(l, locale))
      .filter(isDefined) ?? []
  )
}

export const mapHealthDirectorateLicense = (
  data: HealthDirectorateLicenseToPractice,
  locale: Locale,
): License => {
  let status: Status
  switch (data.status) {
    case 'LIMITED':
      status = Status.LIMITED
      break
    case 'VALID':
      status = Status.VALID
      break
    case 'REVOKED':
      status = Status.REVOKED
      break
    case 'WAIVED':
      status = Status.WAIVED
      break
    case 'INVALID':
      status = Status.INVALID
      break
    default:
      status = Status.UNKNOWN
  }

  const organization: OrganizationSlugType = 'landlaeknir'
  const licenseId = addLicenseTypePrefix(
    data.id.toString(),
    LicenseType.HEALTH_DIRECTORATE,
  )

  return {
    cacheId: `${licenseId}${locale}`,
    licenseId,
    licenseNumber: data.licenseNumber,
    type: LicenseType.HEALTH_DIRECTORATE,
    legalEntityId: data.legalEntityId,
    issuer: organization,
    profession: data.profession,
    permit: data.practice,
    licenseHolderName: data.licenseHolderName,
    licenseHolderNationalId: data.licenseHolderNationalId,
    validFrom: data.validFrom,
    title: `${data.profession} - ${data.practice}`,
    status,
  }
}
