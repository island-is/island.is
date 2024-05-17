import {
  DistrictCommissionersLicenseActionDto,
  mapLicenseActionDto,
} from './districtCommissionersLicenseActionDto'
import {
  DistrictCommissionersLicenseFieldDto,
  mapLicenseFieldDto,
} from './districtCommissionersLicenseFieldDto'
import {
  DistrictCommissionersLicenseInfoDto,
  mapLicenseInfoDto,
} from './districtCommissionersLicenseInfoDto'
import { LeyfiStakt } from '../../../gen/fetch'
import { isDefined } from '@island.is/shared/utils'

export interface DistrictCommissionersLicenseDto {
  licenseInfo: DistrictCommissionersLicenseInfoDto
  holderName: string
  extraFields?: Array<DistrictCommissionersLicenseFieldDto>
  headerText?: string
  footerText?: string
  actions?: Array<DistrictCommissionersLicenseActionDto>
}

export const mapLicenseDto = (
  license: LeyfiStakt,
): DistrictCommissionersLicenseDto | null => {
  if (!license.leyfi) {
    return null
  }

  const licenseInfo = mapLicenseInfoDto(license.leyfi)

  if (!licenseInfo) {
    return null
  }

  return {
    licenseInfo,
    holderName: license.nafn ?? '',
    headerText: license.textar?.haus,
    footerText: license.textar?.fotur,
    actions: license.adgerdir
      ?.map((a) => mapLicenseActionDto(a))
      .filter(isDefined),
    extraFields: license.svid
      ?.map((s) => mapLicenseFieldDto(s))
      .filter(isDefined),
  }
}
