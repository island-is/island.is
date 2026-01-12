import { type Locale } from '@island.is/shared/types'
import type { User } from '@island.is/auth-nest-tools'
import { License } from '../models/license.model'
import { info } from 'kennitala'
import { addLicenseTypePrefix } from '../utils'
import { LicenseType } from '../models/licenseType.model'
import { Status } from '../models/licenseStatus.model'
import {
  DistrictCommissionersLicenseDto,
  DistrictCommissionersLicenseInfoDto,
  DistrictCommissionersLicenseStatus,
} from '@island.is/clients/district-commissioners-licenses'
import { isDefined } from '@island.is/shared/utils'

export const mapDistrictCommissionersLicensesResponse = (
  licenses: DistrictCommissionersLicenseInfoDto[],
  user: User,
  locale: Locale,
): Array<License> => {
  return (
    licenses
      ?.map((l) => {
        const licenseId = addLicenseTypePrefix(
          l.id,
          LicenseType.DISTRICT_COMMISSIONERS,
        )

        return {
          cacheId: `${licenseId}${locale}`,
          licenseId,
          type: LicenseType.DISTRICT_COMMISSIONERS,
          issuer: l.issuerId,
          issuerTitle: l.issuerTitle,
          permit: l.title,
          dateOfBirth: info(user.nationalId).birthday,
          validFrom: l.validFrom,
          title: l.title,
          status: mapDistrictCommissionersLicenseStatusToStatus(l.status),
        }
      })
      .filter(isDefined) ?? []
  )
}
export const mapDistrictCommissionersLicense = (
  license: DistrictCommissionersLicenseDto,
  user: User,
  locale: Locale,
): License => {
  const licenseId = addLicenseTypePrefix(
    license.licenseInfo.id,
    LicenseType.DISTRICT_COMMISSIONERS,
  )

  return {
    cacheId: `${licenseId}${locale}`,
    licenseId,
    type: LicenseType.DISTRICT_COMMISSIONERS,
    licenseHolderName: license.holderName,
    issuer: license.licenseInfo.issuerId,
    dateOfBirth: info(user.nationalId).birthday,
    validFrom: license.licenseInfo.validFrom,
    status: mapDistrictCommissionersLicenseStatusToStatus(
      license.licenseInfo.status,
    ),
    title: license.licenseInfo.title,
    genericFields: license.extraFields ?? [],
  }
}

export const mapDistrictCommissionersLicenseStatusToStatus = (
  status: DistrictCommissionersLicenseStatus,
): Status => {
  switch (status) {
    case 'expired':
      return Status.INVALID

    case 'in-progress':
      return Status.IN_PROGRESS

    case 'valid':
      return Status.VALID

    default:
      return Status.UNKNOWN
  }
}
