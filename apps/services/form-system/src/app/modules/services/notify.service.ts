import { Inject, Injectable } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { NotificationResponseDto } from '../applications/models/dto/validation.response.dto'
import { NotificationDto } from '../applications/models/dto/notification.dto'
import { LoginResponseDto } from './models/login.response.dto'
import { BodyRequestDto } from './models/body.request.dto'

@Injectable()
export class NotifyService {
  enhancedFetch: EnhancedFetchAPI
  private readonly SYSLUMENN_USERNAME = process.env.SYSLUMENN_USERNAME
  private readonly SYSLUMENN_PASSWORD = process.env.SYSLUMENN_PASSWORD

  constructor(
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
      const loginResponse = await this.getAccessToken(url)
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

    const xRoadPath = `${this.xroadBase}/r1/${url}`

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
        return { operationSuccessful: false }
      }
      const responseData = await response.json()
      const externalSystemResponse: NotificationResponseDto = {
        operationSuccessful: responseData.success === true,
        screen: responseData.screen,
      }
      return externalSystemResponse
    } catch (error) {
      this.logger.error(
        `Error sending notification for application ${notificationDto.applicationId}: ${error}`,
      )
      return { operationSuccessful: false }
    }
  }

  private async getAccessToken(url: string): Promise<LoginResponseDto> {
    if (url.toLowerCase().includes('syslumenn-protected')) {
      return await this.getSyslumennLogin('syslumenn-protected')
    }

    return { accessToken: '', audkenni: '' }
  }

  private async getSyslumennLogin(org: string): Promise<LoginResponseDto> {
    const env = this.getEnv(org)

    if (!env) {
      throw new Error(
        `Could not determine environment for organization: ${org}`,
      )
    }

    const loginUrl = `${this.xroadBase}/r1/${env}/Syslumenn-Protected/StarfsKerfi/v1/Innskraning`

    try {
      const response = await this.enhancedFetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Road-Client': this.xroadClient,
        },
        body: JSON.stringify({
          notandi: this.SYSLUMENN_USERNAME,
          lykilord: this.SYSLUMENN_PASSWORD,
        }),
      })

      if (!response.ok) {
        this.logger.error(
          `Syslumenn login failed with status: ${response.status}`,
        )
        this.logger.error(
          `Syslumenn login failed with: ${JSON.stringify(response)}`,
        )
        throw new Error('Syslumenn login failed')
      }

      const data = await response.json()

      if (!data?.accessToken || !data?.audkenni) {
        throw new Error(
          'Syslumenn login response missing accessToken or audkenni',
        )
      }

      const loginResponse: LoginResponseDto = {
        accessToken: data.accessToken,
        audkenni: data.audkenni,
      }

      return loginResponse
    } catch (error) {
      this.logger.error(`Error during Syslumenn login: ${error}`)
      throw error
    }
  }

  private getEnv(org: string): string {
    const isDev =
      this.xroadBase.includes('dev01') || this.xroadBase.includes('localhost')
    const isStaging = this.xroadBase.includes('staging01')

    if (org === 'syslumenn-protected') {
      if (isDev) return 'IS-DEV/GOV/10016'
      if (isStaging) return 'IS-TEST/GOV/10016'
      return 'IS/GOV/5512201410'
    }

    return ''
  }
}
