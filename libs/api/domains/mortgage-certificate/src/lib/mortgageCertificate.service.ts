import { Injectable } from '@nestjs/common'
import {
  MortgageCertificateApi,
  MortgageCertificate,
} from '@island.is/clients/mortgage-certificate'

@Injectable()
export class MortgageCertificateService {
  constructor(
    private readonly mortgageCertificateApi: MortgageCertificateApi,
  ) {}

  async getMortgageCertificate(ssn: string): Promise<MortgageCertificate> {
    return await this.mortgageCertificateApi.getMortgageCertificate(ssn)
  }

  async validateMortgageCertificate(ssn: string): Promise<Boolean> {
    return await this.mortgageCertificateApi.validateMortgageCertificate(ssn)
  }
}
