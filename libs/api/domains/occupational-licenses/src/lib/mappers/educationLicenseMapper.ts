import { type Locale } from '@island.is/shared/types'
import capitalize from 'lodash/capitalize'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { License } from '../models/license.model'
import { info } from 'kennitala'
import { addLicenseTypePrefix } from '../utils'
import { LicenseType } from '../models/licenseType.model'
import { LicenseResponse as MMSLicenseResponse } from '@island.is/clients/mms'
import { Status } from '../models/licenseStatus.model'
import { isDefined } from '@island.is/shared/utils'

export const mapEducationLicensesResponse = (
  licenses: MMSLicenseResponse[],
  locale: Locale,
): Array<License> => {
  return (
    licenses.map((l) => mapEducationLicense(l, locale)).filter(isDefined) ?? []
  )
}

export const mapEducationLicense = (
  data: MMSLicenseResponse,
  locale: Locale,
): License => {
  const issuer: OrganizationSlugType = 'haskoli-islands'
  const licenseId = addLicenseTypePrefix(data.id, LicenseType.EDUCATION)

  return {
    cacheId: `${licenseId}${locale}`,
    licenseId,
    type: LicenseType.EDUCATION,
    issuer,
    issuerTitle: data.issuer,
    profession: capitalize(data.type),
    licenseHolderName: data.fullName,
    licenseHolderNationalId: data.nationalId,
    dateOfBirth: info(data.nationalId).birthday,
    validFrom: new Date(data.issued),
    title: capitalize(data.type),
    status: new Date(data.issued) < new Date() ? Status.VALID : Status.INVALID,
  }
}
