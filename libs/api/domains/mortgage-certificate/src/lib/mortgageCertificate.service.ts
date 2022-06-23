import { Injectable } from '@nestjs/common'
import {
  SyslumennService,
  MortgageCertificate,
  MortgageCertificateValidation,
} from '@island.is/clients/syslumenn'

@Injectable()
export class MortgageCertificateService {
  constructor(private readonly syslumennService: SyslumennService) {}

  async getMortgageCertificate(
    propertyNumber: string,
  ): Promise<MortgageCertificate> {
    return await this.syslumennService.getMortgageCertificate(propertyNumber)
  }

  async validateMortgageCertificate(
    propertyNumber: string,
    isFromSearch: boolean | undefined,
  ): Promise<MortgageCertificateValidation> {
    return await this.syslumennService.validateMortgageCertificate(
      propertyNumber,
      isFromSearch,
    )
  }
}
