import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigType } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { PersonalTaxReturnConfig } from './personalTaxReturn.config'
import * as xml2js from 'xml2js'
import { directTaxPaymentRequest, pdfRequest } from './requests'
import { Period } from './interfaces'
import { DirectTaxPaymentDto, PdfDto } from './dto'
import { DirectTaxPaymentResponse, PdfResponse } from './responses'
import {
  directTaxPaymentResponseToDto,
  pdfResponseToDto,
} from './transformers/transformers'
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors'

@Injectable()
export class PersonalTaxReturnApi {
  constructor(
    @Inject(PersonalTaxReturnConfig.KEY)
    private config: ConfigType<typeof PersonalTaxReturnConfig>,
    private httpService: HttpService,
  ) {}

  async personalTaxReturnInPdf(
    nationalId: string,
    year: number,
  ): Promise<PdfDto> {
    const headers = { Accept: 'gzip', 'Content-Type': 'application/soap+xml' }

    return await lastValueFrom(
      this.httpService.post(
        this.config.url,
        pdfRequest(
          this.config.agentNationalId,
          this.config.agentId,
          this.config.url,
          nationalId,
          year,
        ),
        { headers },
      ),
    ).then(async (response) => {
      const parser = new xml2js.Parser({
        explicitArray: false,
        valueProcessors: [parseBooleans],
      })
      return await parser
        .parseStringPromise(response.data.replace(/(\t\n|\t|\n)/gm, ''))
        .then((parsedResponse: PdfResponse) => {
          return pdfResponseToDto(parsedResponse)
        })
    })
  }

  async directTaxPayments(
    nationalId: string,
    from: Period,
    to: Period,
  ): Promise<DirectTaxPaymentDto> {
    const headers = { 'Content-Type': 'application/soap+xml' }
    return await lastValueFrom(
      this.httpService.post(
        this.config.url,
        directTaxPaymentRequest(
          this.config.agentNationalId,
          this.config.agentId,
          this.config.url,
          nationalId,
          from,
          to,
        ),
        { headers },
      ),
    ).then(async (response) => {
      const parser = new xml2js.Parser({
        explicitArray: false,
        valueProcessors: [parseNumbers, parseBooleans],
      })

      return await parser
        .parseStringPromise(response.data.replace(/(\t\n|\t|\n)/gm, ''))
        .then((parsedResponse: DirectTaxPaymentResponse) => {
          return directTaxPaymentResponseToDto(parsedResponse)
        })
    })
  }
}
