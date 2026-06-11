import { Injectable } from '@nestjs/common'
import { ZendeskService } from './zendesk.service'
import { NotifyService } from './notify.service'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { ValidationService } from './validation.service'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { NotificationCommands } from '@island.is/form-system/enums'
import { NotificationResponseDto } from '../applications/models/dto/notification.response.dto'
import { DataFromUrlResDto } from '../applications/models/dto/dataFromUrl.response.dto'
import { ZendeskListService } from './dataFromUrl/zendeskList.service'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import { DataFromUrlReqDto } from '../applications/models/dto/dataFromUrl.request.dto'
import { DataFromUrlService } from './dataFromUrl/dataFromUrl.service'

@Injectable()
export class ServiceManager {
  constructor(
    private readonly zendeskService: ZendeskService,
    private readonly notifyService: NotifyService,
    private readonly validationService: ValidationService,
    private readonly zendeskListService: ZendeskListService,
    private readonly dataFromUrlService: DataFromUrlService,
  ) {}

  async send(
    applicationDto: ApplicationDto,
    zendeskInstance?: string,
    zendeskBrandId?: string,
  ): Promise<boolean | NotificationResponseDto> {
    const submitUrl = applicationDto.submissionServiceUrl

    if (!submitUrl) {
      throw new Error('No submission URL configured for this application')
    }

    if (submitUrl === 'zendesk') {
      return await this.zendeskService.sendToZendesk(
        applicationDto,
        zendeskInstance,
        zendeskBrandId,
      )
    } else if (submitUrl !== 'zendesk') {
      const notificationDto = {
        applicationId: applicationDto.id ?? '',
        nationalId: applicationDto.nationalId ?? '',
        slug: applicationDto.slug ?? '',
        isTest: applicationDto.isTest ?? false,
        command: NotificationCommands.SUBMIT,
      }
      const response = await this.notifyService.sendNotification(
        notificationDto,
        submitUrl,
      )
      return response.operationSuccessful ?? false
    }

    return false
  }

  async getListFromZendesk(
    fieldSettings: FieldSettings,
    dataFromUrlRequestDto: DataFromUrlReqDto,
  ): Promise<DataFromUrlResDto> {
    return await this.zendeskListService.getListFromZendesk(
      fieldSettings,
      dataFromUrlRequestDto,
    )
  }

  async getDataFromUrl(
    fieldSettings: FieldSettings,
    dataFromUrlRequestDto: DataFromUrlReqDto,
  ) {
    return await this.dataFromUrlService.getDataFromUrl(
      fieldSettings,
      dataFromUrlRequestDto,
    )
  }

  async validation(screenDto: ScreenDto): Promise<ScreenValidationResponse> {
    const screenValidationResponse =
      await this.validationService.validateScreen(screenDto)
    return screenValidationResponse
  }
}
