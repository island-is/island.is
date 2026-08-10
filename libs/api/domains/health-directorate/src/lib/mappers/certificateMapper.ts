import {
  CertificateDto,
  CertificateRequestDto,
  CertificateTypeCode,
  PaymentDto,
} from '@island.is/clients/health-directorate'
import { CertificateTypeEnum, PaymentStatusEnum } from '../models/enums'
import { HealthDirectorateCertificate } from '../models/certificate.model'
import { HealthDirectorateCertificateRequest } from '../models/certificateRequest.model'
import { HealthDirectoratePayment } from '../models/payment.model'

/**
 * The certificate request endpoint expects a date-only string
 * (YYYY-MM-DD), not a full ISO timestamp.
 */
export const toDateOnly = (date: Date): string =>
  date.toISOString().slice(0, 10)

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

export const mapCertificate = (
  dto: CertificateDto,
  downloadServiceURL: string,
): HealthDirectorateCertificate => ({
  id: dto.id,
  conversationId: dto.conversationId,
  messageId: dto.messageId,
  conversationTypeCode: dto.conversationTypeCode,
  certificateRequestId: dto.certificateRequestId,
  issuedAt: dto.issuedAt,
  requiresPayment: dto.requiresPayment,
  paid: dto.paid,
  amountIsk: dto.amountIsk,
  downloadServiceURL,
})

export const mapPayment = (dto: PaymentDto): HealthDirectoratePayment => ({
  id: dto.id,
  status:
    dto.status === 'SUCCEEDED'
      ? PaymentStatusEnum.SUCCEEDED
      : PaymentStatusEnum.PENDING,
  resourceId: dto.resourceId,
  amountIsk: dto.amountIsk,
  paidAt: dto.paidAt,
})
