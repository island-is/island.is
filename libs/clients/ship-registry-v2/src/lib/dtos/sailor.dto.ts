import type { SailorSchoolCertificateDto } from './sailorSchoolCertificate.dto'
import type { SailorRightCertificateDto } from './sailorRightCertificate.dto'
import type { SailorMaritimeBookDto } from './sailorMaritimeBook.dto'
import type { SailorRegistrationExemptionDto } from './sailorRegistrationExemption.dto'

export interface SailorCertificatesDto {
  schoolCertificates: SailorSchoolCertificateDto[]
  rightCertificates: SailorRightCertificateDto[]
  maritimeBooks: SailorMaritimeBookDto[]
  registrationExemptions: SailorRegistrationExemptionDto[]
}
