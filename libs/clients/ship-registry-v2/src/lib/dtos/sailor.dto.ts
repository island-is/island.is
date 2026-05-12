import { isDefined } from '@island.is/shared/utils'
import { SailorRegistrationInfoDto } from '../../../gen/fetch'
import { mapSchoolCertificate } from './sailorSchoolCertificate.dto'
import { mapRightCertificate } from './sailorRightCertificate.dto'
import type { SailorSchoolCertificateDto } from './sailorSchoolCertificate.dto'
import type { SailorRightCertificateDto } from './sailorRightCertificate.dto'

export interface SailorCertificatesDto {
  schoolCertificates: SailorSchoolCertificateDto[]
  rightCertificates: SailorRightCertificateDto[]
}

export const mapSailorCertificates = (
  dto: SailorRegistrationInfoDto,
): SailorCertificatesDto => ({
  schoolCertificates: (dto.schoolCertificates ?? []).map(mapSchoolCertificate),
  rightCertificates: (dto.rightCertificates ?? [])
    .map(mapRightCertificate)
    .filter(isDefined),
})
