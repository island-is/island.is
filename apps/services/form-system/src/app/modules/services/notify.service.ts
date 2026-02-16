import { Inject, Injectable } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { ValidationResponseDto } from '../applications/models/dto/validation.response.dto'
import { NotificationDto } from '../applications/models/dto/notification.dto'

@Injectable()
export class NotifyService {
  enhancedFetch: EnhancedFetchAPI

  constructor(
    @Inject(XRoadConfig.KEY)
    private readonly xRoadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(SyslumennClientConfig.KEY)
    private syslumennConfig: ConfigType<typeof SyslumennClientConfig>,
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
  ): Promise<ValidationResponseDto> {
    if (!this.xroadBase || !this.xroadClient) {
      throw new Error(
        `X-Road configuration is missing for NotifyService. Please check environment variables.`,
      )
    }
    let accessToken: string | null = null
    try {
      accessToken = await this.getAccessToken(url)
    } catch (error) {
      this.logger.error(
        `Error acquiring access token for application ${notificationDto.applicationId}: ${error}`,
      )
      return { success: false }
    }

    const xRoadPath = `${this.xroadBase}/r1/${url}`

    this.logger.info(`Sending notification to URL: ${xRoadPath}`)

    try {
      const response = await this.enhancedFetch(xRoadPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Road-Client': this.xroadClient,
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(notificationDto),
      })

      if (!response.ok) {
        this.logger.error(
          `Non-OK response for application ${notificationDto.applicationId}`,
        )
        return { success: false }
      }
      const responseData = await response.json()
      const externalSystemResponse: ValidationResponseDto = {
        success: responseData.success,
        screen: responseData.screen,
      }
      return externalSystemResponse
    } catch (error) {
      this.logger.error(
        `Error sending notification for application ${notificationDto.applicationId}: ${error}`,
      )
      return { success: false }
    }
  }

  private async getAccessToken(url: string): Promise<string | null> {
    if (url.toLowerCase().includes('syslumenn-protected')) {
      return await this.getSyslumennAccessToken('syslumenn-protected')
    }

    return null
  }

  private async getSyslumennAccessToken(org: string): Promise<string> {
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
          notandi: this.syslumennConfig.username,
          lykilord: this.syslumennConfig.password,
        }),
      })

      if (!response.ok) {
        this.logger.error(
          `Syslumenn login failed with status: ${response.status}`,
        )
        this.logger.error(`Syslumenn login failed with: ${response}`)
        throw new Error('Syslumenn login failed')
      }

      const data = await response.json()
      if (!data?.accessToken) {
        throw new Error('Syslumenn login response missing accessToken')
      }
      return data.accessToken
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
