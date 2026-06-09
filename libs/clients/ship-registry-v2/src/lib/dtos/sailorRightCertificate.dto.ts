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
  if (!dto.certificateSerialNo) return undefined
  const serialNo = String(dto.certificateSerialNo)

  const validToDate = dto.expirationDate
    ? parseDate(dto.expirationDate) ?? undefined
    : undefined

  const status: SailorCertificateStatus =
    validToDate != null
      ? validToDate >= new Date()
        ? 'Valid'
        : 'Invalid'
      : 'Unknown'

  return {
    id: serialNo,
    type: dto.rightCertificateType || undefined,
    rightsCategories:
      dto.rightTypes && dto.rightTypes !== '-' ? dto.rightTypes : undefined,
    certificateNumber: serialNo,
    issueDate: dto.issueDate
      ? parseDate(dto.issueDate) ?? undefined
      : undefined,
    validToDate,
    status,
  }
}
