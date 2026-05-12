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
  const validToDate = dto.validTo?.value
    ? parseDate(dto.validTo.value) ?? undefined
    : undefined

  const status: SailorCertificateStatus =
    validToDate != null
      ? validToDate >= new Date()
        ? 'Valid'
        : 'Invalid'
      : 'Unknown'

  return {
    id: String(index),
    title: dto.schoolCertificate?.value ?? undefined,
    school: dto.school?.value ?? undefined,
    issueDate: dto.examDate?.value
      ? parseDate(dto.examDate.value) ?? undefined
      : undefined,
    validToDate,
    status,
  }
}
