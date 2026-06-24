import { SchoolCertificateIslandIsDto } from '../../../gen/fetch'
import { parseDate } from '../utils'
import type { SailorCertificateStatus } from '../types'

export interface SailorSchoolCertificateDto {
  id: string
  title?: string
  school?: string
  issueDate?: Date
  validToDate?: Date
  status: SailorCertificateStatus
}

export const mapSchoolCertificate = (
  dto: SchoolCertificateIslandIsDto,
  index: number,
): SailorSchoolCertificateDto => {
  const validToDate = dto.validTo
    ? parseDate(dto.validTo) ?? undefined
    : undefined

  const status: SailorCertificateStatus =
    validToDate != null
      ? validToDate >= new Date()
        ? 'Valid'
        : 'Invalid'
      : 'Unknown'

  return {
    id: String(index),
    title: dto.schoolCertificate ?? undefined,
    school: dto.school ?? undefined,
    issueDate: dto.examDate ? parseDate(dto.examDate) ?? undefined : undefined,
    validToDate,
    status,
  }
}
