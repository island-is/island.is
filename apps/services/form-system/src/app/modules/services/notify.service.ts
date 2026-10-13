import { Inject, Injectable } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { NotificationResponseDto } from '../applications/models/dto/notification.response.dto'
import { NotificationDto } from '../applications/models/dto/notification.dto'
import { BodyRequestDto } from './models/body.request.dto'
import { NotificationCommands } from '@island.is/form-system/shared'
import { AuthService } from './auth.service'

@Injectable()
export class NotifyService {
  enhancedFetch: EnhancedFetchAPI

  constructor(
    private readonly authService: AuthService,
    @Inject(XRoadConfig.KEY)
    private readonly xRoadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.enhancedFetch = createEnhancedFetch({
      name: 'form-system-notify-service',
      organizationSlug: 'stafraent-island',
      timeout: 40000,
      logErrorResponseBody: true,
    })
  }
  private readonly xroadBase = this.xRoadConfig.xRoadBasePath
  private readonly xroadClient = this.xRoadConfig.xRoadClient

  async sendNotification(
    notificationDto: NotificationDto,
    url: string,
  ): Promise<NotificationResponseDto> {
    const logContext = {
      applicationId: notificationDto.applicationId,
      formSlug: notificationDto.slug,
      isTest: notificationDto.isTest,
      notificationCommand: notificationDto.command,
      organizationNationalId: notificationDto.organizationNationalId,
      url,
    }

    if (!this.xroadBase || !this.xroadClient) {
      this.logger.error('form system notification configuration missing', {
        ...logContext,
        missingXRoadBase: !this.xroadBase,
        missingXRoadClient: !this.xroadClient,
        datadogEvent: 'form_system_notification_send_failed',
      })
      throw new Error(
        `X-Road configuration is missing for NotifyService. Please check environment variables.`,
      )
    }
    let accessToken = ''
    let audkenni = ''
    try {
      const loginResponse = await this.authService.getAccessToken(url)
      accessToken = loginResponse.accessToken
      audkenni = loginResponse.audkenni
    } catch (error) {
      this.logger.error('form system notification token acquisition failed', {
        ...logContext,
        datadogEvent: 'form_system_notification_send_failed',
        error,
      })
      return { operationSuccessful: false }
    }

    const notificationRequest: BodyRequestDto = {
      notification: notificationDto,
      ...(audkenni ? { audkenni } : {}),
    }

    const xRoadPath = `${this.xroadBase}${url}`

    try {
      const response = await this.enhancedFetch(xRoadPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Road-Client': this.xroadClient,
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(notificationRequest),
      })

      const responseData = await response.json()

      if (!response.ok) {
        this.logger.error('form system notification request failed', {
          ...logContext,
          status: response.status,
          statusText: response.statusText,
          responseError: responseData.error,
          datadogEvent: 'form_system_notification_send_failed',
        })
      }

      let operationSuccessful = response.ok

      if (notificationDto.command === NotificationCommands.SUBMIT) {
        if (response.ok && responseData.success !== true) {
          this.logger.error('form system notification submit rejected', {
            ...logContext,
            responseError: responseData.error ?? 'no error detail',
            responseSuccess: responseData.success,
            datadogEvent: 'form_system_notification_send_failed',
          })
        }
        operationSuccessful = response.ok && responseData.success === true
      }

      const externalSystemResponse: NotificationResponseDto = {
        operationSuccessful: operationSuccessful,
        screen: responseData.screen,
        screenError: responseData.screenError,
      }
      if (operationSuccessful) {
        this.logger.info('form system notification sent', {
          ...logContext,
          status: response.status,
          datadogEvent: 'form_system_notification_sent',
        })
      }
      return externalSystemResponse
    } catch (error) {
      this.logger.error('form system notification send failed', {
        ...logContext,
        datadogEvent: 'form_system_notification_send_failed',
        error,
      })
      return { operationSuccessful: false }
    }
  }
}
