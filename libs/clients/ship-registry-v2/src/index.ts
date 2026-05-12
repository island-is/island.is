export { ShipRegistryClientV2Service } from './lib/ship-registry.service'
export { ShipRegistryClientV2Module } from './lib/ship-registry.module'
export { ShipRegistryClientV2Config } from './lib/ship-registry.config'
export type {
  SailorCertificateStatus,
  ShipCertificateIssueStatus,
} from './lib/types'
export type { SailorCertificatesDto } from './lib/dtos/sailor.dto'
export type { SailorSchoolCertificateDto } from './lib/dtos/sailorSchoolCertificate.dto'
export type { SailorRightCertificateDto } from './lib/dtos/sailorRightCertificate.dto'
export type { ShipCertificateDto } from './lib/dtos/shipCertificate.dto'
export type {
  ShipDetailDto,
  ShipRegistrationInfoParsedDto,
} from './lib/dtos/ship.dto'
export type {
  ShipBaseInfoDto,
  Translation,
  ValueMessageDto,
  ValueUnitMessageDto,
} from '../gen/fetch'
