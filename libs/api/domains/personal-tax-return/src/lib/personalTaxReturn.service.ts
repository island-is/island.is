import { Injectable } from '@nestjs/common'

import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'

@Injectable()
export class PersonalTaxReturnService {
  constructor(private personalTaxReturnApi: PersonalTaxReturnApi) {}

  async personalTaxReturnPdf(nationalId: string, year: string) {
    return await this.personalTaxReturnApi.personalTaxReturnInPdf(
      nationalId,
      year,
    )
  }
}
