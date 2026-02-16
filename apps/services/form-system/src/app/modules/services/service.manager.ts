import { Injectable } from '@nestjs/common'
import { ZendeskService } from './zendesk.service'
import { NotifyService } from './notify.service'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { ValidationService } from './validation.service'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { NotificationActions } from '@island.is/form-system/enums'

@Injectable()
export class ServiceManager {
  constructor(
    private readonly zendeskService: ZendeskService,
    private readonly notifyService: NotifyService,
    private readonly validationService: ValidationService,
  ) {}

  async send(applicationDto: ApplicationDto): Promise<boolean> {
    const submitUrl = applicationDto.submissionServiceUrl

    if (!submitUrl) {
      throw new Error('No submission URL configured for this application')
    }

    if (submitUrl === 'zendesk') {
      return await this.zendeskService.sendToZendesk(applicationDto)
    } else if (submitUrl !== 'zendesk') {
      const notificationDto = {
        applicationId: applicationDto.id ?? '',
        nationalId: applicationDto.nationalId ?? '',
        slug: applicationDto.slug ?? '',
        isTest: applicationDto.isTest ?? false,
        command: NotificationActions.SUBMIT,
      }
      const response = await this.notifyService.sendNotification(
        notificationDto,
        submitUrl,
      )
      return response.validationFailed ?? false
    }

    return false
  }

  async validation(screenDto: ScreenDto): Promise<ScreenValidationResponse> {
    const screenValidationResponse =
      await this.validationService.validateScreen(screenDto)
    return screenValidationResponse
  }
}
