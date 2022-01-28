import { HttpService, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PersonalTaxReturnConfig } from './personalTaxReturn.config'
import { pdfRequest } from './requests/pdf'
import * as xml2js from 'xml2js'
import { PdfDto, PdfResponse } from './dto/pdf.dto'

@Injectable()
export class PersonalTaxReturnApi {
  constructor(
    @Inject(PersonalTaxReturnConfig.KEY)
    private config: ConfigType<typeof PersonalTaxReturnConfig>,
    private httpService: HttpService,
  ) {}

  async personalTaxReturnInPdf(
    nationalId: string,
    year: string,
  ): Promise<PdfDto> {
    const headers = { Accept: 'gzip', 'Content-Type': 'application/soap+xml' }

    return await this.httpService
      .post(
        this.config.url,
        pdfRequest(
          this.config.agentNationalId,
          this.config.agentId,
          nationalId,
          year,
        ),
        { headers },
      )
      .toPromise()
      .then(async (response) => {
        const parser = new xml2js.Parser()
        return await parser
          .parseStringPromise(response.data.replace(/(\t\n|\t|\n)/gm, ''))
          .then((parsedResponse: PdfResponse) => {
            return {
              success:
                parsedResponse['s:Envelope']['s:Body'][0]
                  .SaekjaPDFAfritFramtalsEinstaklingsResponse[0]['b:Tokst'],
              errorText:
                parsedResponse['s:Envelope']['s:Body'][0]
                  .SaekjaPDFAfritFramtalsEinstaklingsResponse[0]['b:Villubod'],
              content:
                parsedResponse['s:Envelope']['s:Body'][0]
                  .SaekjaPDFAfritFramtalsEinstaklingsResponse[0][
                  'b:PDFAfritFramtals'
                ],
            }
          })
      })
      .catch((err) => err)
  }
}
