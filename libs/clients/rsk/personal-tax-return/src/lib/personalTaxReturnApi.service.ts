import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PersonalTaxReturnConfig } from './personalTaxReturn.config'
import { pdfRequest } from './requests/pdf'

@Injectable()
export class PersonalTaxReturnApi {
  constructor(
    @Inject(PersonalTaxReturnConfig.KEY)
    private config: ConfigType<typeof PersonalTaxReturnConfig>,
  ) {}

  async personalTaxReturnInPdf(
    nationalId: string,
    year: string,
  ): Promise<string> {
    const response = await fetch(this.config.url, {
      body: pdfRequest(
        this.config.agentNationalId,
        this.config.agentId,
        nationalId,
        year,
      ),
    })

    console.log(response)
    return 'bla'
  }
}
