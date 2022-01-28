import { Injectable } from '@nestjs/common'

import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'

@Injectable()
export class PersonalTaxReturnService {
  constructor(private personalTaxReturnApi: PersonalTaxReturnApi) {}

  async personalTaxReturnPdf(nationalId: string, year: string) {
    console.log('personal tax return service')
    const taxReturn = await this.personalTaxReturnApi.personalTaxReturnInPdf(
      nationalId,
      year,
    )

    return taxReturn.content
  }
}
