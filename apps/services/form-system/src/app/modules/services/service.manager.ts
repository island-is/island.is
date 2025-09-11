import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormUrl } from '../formUrls/models/formUrl.model'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import { ZendeskService } from './zendesk.service'
import { NudgeService } from './nudge.service'
import { UrlMethods, UrlTypes } from '@island.is/form-system/shared'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { ValidationService } from './validation.service'
import { ScreenDto } from '../screens/models/dto/screen.dto'

@Injectable()
export class ServiceManager {
  constructor(
    @InjectModel(FormUrl)
    private readonly formUrlModel: typeof FormUrl,
    @InjectModel(OrganizationUrl)
    private readonly organizationUrlModel: typeof OrganizationUrl,
    private readonly zendeskService: ZendeskService,
    private readonly nugdeService: NudgeService,
    private readonly validationService: ValidationService,
  ) {}

  async send(applicationDto: ApplicationDto): Promise<boolean> {
    const formUrls = await this.formUrlModel.findAll({
      where: { formId: applicationDto.formId },
    })

    if (formUrls.length === 0) {
      return false
    }

    const submitUrl = await this.organizationUrlModel.findOne({
      where: {
        id: formUrls.map((formUrl) => formUrl.organizationUrlId),
        type: UrlTypes.SUBMIT,
        isTest: applicationDto.isTest,
      },
    })

    if (submitUrl && submitUrl?.method === UrlMethods.SEND_NUDGE) {
      return await this.nugdeService.sendNudge(applicationDto, submitUrl)
    } else if (submitUrl && submitUrl?.method === UrlMethods.SEND_TO_ZENDESK) {
      return await this.zendeskService.sendToZendesk(applicationDto, submitUrl)
    }

    return false
  }

  async validation(screenDto: ScreenDto): Promise<ScreenValidationResponse> {
    const screenValidationResponse =
      await this.validationService.validateScreen(screenDto)
    return screenValidationResponse
  }
}
