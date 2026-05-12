import { RightCertificateIslandisDto } from '../../../gen/fetch'
import { parseDate } from '../utils'
import type { SailorCertificateStatus } from '../types'

export interface SailorRightCertificateDto {
  id: string
  type?: string
  rightsCategories?: string
  certificateNumber?: string
  issueDate?: Date
  validToDate?: Date
  status: SailorCertificateStatus
}

export const mapRightCertificate = (
  dto: RightCertificateIslandisDto,
): SailorRightCertificateDto | undefined => {
  const serialNo = dto.certificateSerialNo?.value || undefined
  if (!serialNo) return undefined

  const rawStatus = dto.certificateStatus?.status
  const status: SailorCertificateStatus =
    rawStatus === 'VALID'
      ? 'Valid'
      : rawStatus === 'INVALID'
      ? 'Invalid'
      : 'Unknown'

  return {
    id: serialNo,
    type: dto.rightCertificateType?.value ?? undefined,
    rightsCategories:
      dto.rightTypes?.value && dto.rightTypes.value !== '-'
        ? dto.rightTypes.value
        : undefined,
    certificateNumber: serialNo,
    issueDate: dto.issueDate?.value
      ? parseDate(dto.issueDate.value) ?? undefined
      : undefined,
    validToDate: dto.expirationDate?.value
      ? parseDate(dto.expirationDate.value) ?? undefined
      : undefined,
    status,
  }
}
