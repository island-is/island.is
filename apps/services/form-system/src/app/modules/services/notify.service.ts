import { Inject, Injectable } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { NotificationResponseDto } from '../applications/models/dto/notification.response.dto'
import { NotificationDto } from '../applications/models/dto/notification.dto'
import { LoginResponseDto } from './models/login.response.dto'
import { BodyRequestDto } from './models/body.request.dto'
import { NotificationCommands } from '@island.is/form-system/shared'

@Injectable()
export class NotifyService {
  enhancedFetch: EnhancedFetchAPI
  private readonly SYSLUMENN_USERNAME = process.env.SYSLUMENN_USERNAME
  private readonly SYSLUMENN_PASSWORD = process.env.SYSLUMENN_PASSWORD
  private readonly NTI_USERNAME = process.env.NTI_USERNAME
  private readonly NTI_PASSWORD = process.env.NTI_PASSWORD

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

  private async getAccessToken(url: string): Promise<LoginResponseDto> {
    if (url.toLowerCase().includes('syslumenn-protected')) {
      return await this.getSyslumennLogin('syslumenn-protected')
    } else if (
      url.toLowerCase().includes('natturuhamfaratryggingislands-protected')
    ) {
      return await this.getNTILogin('natturuhamfaratryggingislands-protected')
    }

    return { accessToken: '', audkenni: '' }
  }

  private async getNTILogin(org: string): Promise<LoginResponseDto> {
    const env = this.getEnv(org)

    if (!env) {
      throw new Error(
        `Could not determine environment for organization: ${org}`,
      )
    }

    const loginUrl = `${this.xroadBase}${env}/NatturuhamfaratryggingIslands-Protected/Tjonakerfi_NTI-v0.1/services/oauth2/token`

    try {
      const response = await this.enhancedFetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Road-Client': this.xroadClient,
        },
        body: JSON.stringify({
          client_id: this.NTI_USERNAME,
          client_secret: this.NTI_PASSWORD,
          grant_type: 'client_credentials',
        }),
      })

      if (!response.ok) {
        this.logger.error(`NTI login failed with status: ${response.status}`)
        this.logger.error(`NTI login failed with: ${response}`)
        throw new Error('NTI login failed')
      }

      const data = await response.json()

      if (!data?.accessToken) {
        throw new Error('NTI login response missing accessToken')
      }

      const loginResponse: LoginResponseDto = {
        accessToken: data.Access_Token,
        audkenni: '',
      }

      return loginResponse
    } catch (error) {
      this.logger.error(`Error during NTI login: ${error}`)
      throw error
    }
  }

  private async getSyslumennLogin(org: string): Promise<LoginResponseDto> {
    const env = this.getEnv(org)

    if (!env) {
      throw new Error(
        `Could not determine environment for organization: ${org}`,
      )
    }

    const loginUrl = `${this.xroadBase}${env}/Syslumenn-Protected/StarfsKerfi/v1/Innskraning`

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
        this.logger.error(`Syslumenn login failed with: ${response}`)
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
      if (isDev) return '/r1/IS-DEV/GOV/10016'
      if (isStaging) return '/r1/IS-TEST/GOV/10016'
      return '/r1/IS/GOV/5512201410'
    } else if (org === 'natturuhamfaratryggingislands-protected') {
      if (isDev) return '/r1/IS-DEV/GOV/10037'
      if (isStaging) return '/r1/IS-TEST/GOV/10037'
      return '/r1/IS/GOV/5202760259'
    }

    return ''
  }
}
