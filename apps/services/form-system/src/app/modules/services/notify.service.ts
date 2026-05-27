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
    if (!this.xroadBase || !this.xroadClient) {
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
      this.logger.error(
        `Error acquiring login tokens for application ${notificationDto.applicationId}: ${error}`,
      )
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

      if (!response.ok) {
        this.logger.error(
          `Non-OK response for application ${notificationDto.applicationId}`,
        )
      }

      const responseData = await response.json()
      let operationSuccessful = response.ok

      if (notificationDto.command === NotificationCommands.SUBMIT) {
        if (response.ok && responseData.success !== true) {
          this.logger.error(
            `SUBMIT rejected by external system for application ${
              notificationDto.applicationId
            }: ${responseData.error ?? 'no error detail'}`,
          )
        }
        operationSuccessful = response.ok && responseData.success === true
      }

      const externalSystemResponse: NotificationResponseDto = {
        operationSuccessful: operationSuccessful,
        screen: responseData.screen,
        screenError: responseData.screenError,
      }
      return externalSystemResponse
    } catch (error) {
      this.logger.error(
        `Error sending notification for application ${notificationDto.applicationId}: ${error}`,
      )
      return { operationSuccessful: false }
    }
  }
}
