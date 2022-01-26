import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PersonalTaxReturnsConfig } from './personalTaxReturns.config'
import { pdfRequest } from './requests/pdf'

@Injectable()
export class PersonalTaxReturnsService {
  constructor(
    @Inject(PersonalTaxReturnsConfig.KEY)
    private config: ConfigType<typeof PersonalTaxReturnsConfig>,
  ) {}

  async personalTaxReturnsInPdf(
    year: string,
    nationalId: string,
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
