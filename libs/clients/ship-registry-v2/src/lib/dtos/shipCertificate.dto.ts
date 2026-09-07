import { ShipCertificateDetailDto } from '../../../gen/fetch'
import { parseDate } from '../utils'
import type { ShipCertificateIssueStatus } from '../types'

export interface ShipCertificateDto {
  certificateTypeName: string
  certificateIssueStatusEnum: ShipCertificateIssueStatus
  issueDate: Date
  validToDate?: Date
  extensionDate?: Date
}

export const mapShipCertificate = (
  cert: ShipCertificateDetailDto,
): ShipCertificateDto | undefined => {
  if (!cert.certificateTypeName) return undefined
  const issueDate = cert.issueDate ? parseDate(cert.issueDate) : null
  if (!issueDate) return undefined

  return {
    certificateTypeName: cert.certificateTypeName,
    certificateIssueStatusEnum: cert.certificateIssueStatusEnum,
    issueDate,
    validToDate:
      cert.validToDate != null && cert.validToDate !== ''
        ? parseDate(cert.validToDate) ?? undefined
        : undefined,
    extensionDate: cert.extensionDate
      ? parseDate(cert.extensionDate) ?? undefined
      : undefined,
  }
}
