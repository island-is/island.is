import {
  CertificateRequestDto,
  CertificateTypeCode,
} from '@island.is/clients/health-directorate'
import { CertificateTypeEnum } from '../models/enums'
import { HealthDirectorateCertificateRequest } from '../models/certificateRequest.model'

export const toCertificateTypeCode = (
  value: CertificateTypeEnum,
): CertificateTypeCode => {
  switch (value) {
    case CertificateTypeEnum.WORK:
      return CertificateTypeCode.WORK
    case CertificateTypeEnum.SCHOOL:
      return CertificateTypeCode.SCHOOL
  }
}

export const fromCertificateTypeCode = (
  value: CertificateTypeCode,
): CertificateTypeEnum => {
  switch (value) {
    case CertificateTypeCode.WORK:
      return CertificateTypeEnum.WORK
    case CertificateTypeCode.SCHOOL:
      return CertificateTypeEnum.SCHOOL
  }
}

export const mapCertificateRequest = (
  dto: CertificateRequestDto,
): HealthDirectorateCertificateRequest => ({
  id: dto.id,
  conversationId: dto.conversationId,
  certificateType: fromCertificateTypeCode(dto.certificateType),
  recipientName: dto.recipientName,
  startDate: dto.startDate,
  endDate: dto.endDate,
  note: dto.note,
  status: dto.status,
  isAutomatic: dto.isAutomatic,
  requestedAt: dto.requestedAt,
})
