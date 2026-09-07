import { isDefined } from '@island.is/shared/utils'
import { MyShipDetailDto, ShipRegistrationInfoDto } from '../../../gen/fetch'
import { parseDate } from '../utils'
import {
  mapShipCertificate,
  type ShipCertificateDto,
} from './shipCertificate.dto'

export interface ShipRegistrationInfoParsedDto extends ShipRegistrationInfoDto {
  seaworthyExpiryDateParsed?: Date
}

export interface ShipDetailDto
  extends Omit<
    MyShipDetailDto,
    'shipRegistrationInfo' | 'shipCertificateDetails'
  > {
  shipRegistrationInfo: ShipRegistrationInfoParsedDto
  shipCertificateDetails: ShipCertificateDto[]
}

export const mapShipDetail = (dto: MyShipDetailDto): ShipDetailDto => {
  const info = dto.shipRegistrationInfo
  const seaworthyExpiryDateParsed =
    info?.seaworthyExpiryDate?.value && info.seaworthyExpiryDate.value !== '-'
      ? parseDate(info.seaworthyExpiryDate.value, 'yyyy-MM-dd HH:mm:ss') ??
        undefined
      : undefined

  return {
    ...dto,
    shipRegistrationInfo: { ...info, seaworthyExpiryDateParsed },
    shipCertificateDetails: (dto.shipCertificateDetails ?? [])
      .map(mapShipCertificate)
      .filter(isDefined),
  }
}
