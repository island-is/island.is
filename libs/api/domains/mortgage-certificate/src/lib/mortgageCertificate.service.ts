import { Injectable } from '@nestjs/common'
// import {
//   MortgageCertificateApi,
//   MortgageCertificate,
// } from '@island.is/clients/mortgage-certificate'
import {
  SyslumennService,
  MortgageCertificate,
} from '@island.is/clients/syslumenn'

@Injectable()
export class MortgageCertificateService {
  constructor(
    // private readonly mortgageCertificateApi: MortgageCertificateApi,
    private readonly syslumennService: SyslumennService,
  ) {}

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
