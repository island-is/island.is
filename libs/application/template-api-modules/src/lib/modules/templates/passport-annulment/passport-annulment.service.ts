import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { PassportsService } from '@island.is/clients/passports'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { PassportAnnulmentAnswers } from './constants'

@Injectable()
export class PassportAnnulmentService extends BaseTemplateApiService {
  constructor(private passportApi: PassportsService) {
    super(ApplicationTypes.PASSPORT_ANNULMENT)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
  }> {
    const {
      status,
      comment,
      passportNumber,
    } = application.answers as PassportAnnulmentAnswers
    // const result = await this.passportApi.
    console.log(status, comment, passportNumber)
    // {"status":"lost","comment":"Týndist í fluttningum síðasta haust.Týndist í fluttningum síðasta haust.Týndist í fluttningum síðasta haust.Týndist í fluttningum síðasta haust.Týndist í fluttningum síðasta haust.","passport":{"userPassport":"A2276548,Gervimaður Ameríku ","childPassport":""},"passportName":"Gervimaður Ameríku ","passportNumber":"A2276548","approveExternalData":true}
    return { success: false }
  }
}
