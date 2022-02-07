import { Injectable } from '@nestjs/common'
import {
  SyslumennService,
  MortgageCertificate,
} from '@island.is/clients/syslumenn'

@Injectable()
export class MortgageCertificateService {
  constructor(private readonly syslumennService: SyslumennService) {}

  async getMortgageCertificate(
    realEstateNumber: string,
  ): Promise<MortgageCertificate> {
    return await this.syslumennService.getMortgageCertificate(realEstateNumber)
  }

  async validateMortgageCertificate(
    realEstateNumber: string,
  ): Promise<Boolean> {
    return await this.syslumennService.validateMortgageCertificate(
      realEstateNumber,
    )
  }
}
