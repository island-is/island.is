import {
  CertificateDto,
  CertificateRequestDto,
  CertificateTypeCode,
} from '@island.is/clients/health-directorate'
import { CertificateTypeEnum } from '../models/enums'
import { HealthDirectorateCertificate } from '../models/certificate.model'
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

export const mapCertificateRequest = (
  dto: CertificateRequestDto,
): HealthDirectorateCertificateRequest => ({
  id: dto.id,
  conversationId: dto.conversationId,
})

export const mapCertificate = (
  dto: CertificateDto,
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
})
