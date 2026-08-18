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

export const mapCertificateRequest = (
  dto: CertificateRequestDto,
): HealthDirectorateCertificateRequest => ({
  id: dto.id,
  conversationId: dto.conversationId,
})
