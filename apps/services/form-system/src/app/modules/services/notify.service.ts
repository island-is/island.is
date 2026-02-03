import { Inject, Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { getStaticEnv } from '@island.is/shared/utils'

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
    applicationDto: ApplicationDto,
    url: string,
  ): Promise<boolean> {
    if (!this.xroadBase || !this.xroadClient) {
      throw new Error(
        `X-Road configuration is missing for NotifyService in form ${applicationDto.slug}. Please check environment variables.`,
      )
    }

    let accessToken = ''
    if (url.toLowerCase().includes('syslumenn-protected')) {
      accessToken = await this.getSyslumennAccessToken()
    }

    const xRoadPath = `${this.xroadBase}/r1/${url}`

    console.log('Sending notification to URL:', xRoadPath)
    this.logger.info('Sending notification to URL:', xRoadPath)

    try {
      const response = await this.enhancedFetch(xRoadPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Road-Client': this.xroadClient,
          ...(accessToken !== '' && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({
          applicationId: applicationDto.id,
          applicationType: applicationDto.slug,
        }),
      })

      const responseBody = await response.text()
      this.logger.info(
        `Response Status: ${response.status}, Body: ${responseBody}`,
      )
      if (!response.ok) {
        this.logger.warn(`Non-OK response for form ${applicationDto.slug}`)
        return false
      }
    } catch (error) {
      console.error(
        `Error sending notification for form ${applicationDto.slug}: ${error}`,
      )
      this.logger.error(
        `Error sending notification for form ${applicationDto.slug}: ${error}`,
      )
      return false
    }

    return true
  }

  private async getSyslumennAccessToken(): Promise<string> {
    // console.log(`Syslumenn url: ${this.syslumennConfig.url}`)
    this.logger.info(`Syslumenn url: ${this.syslumennConfig.url}`)
    this.logger.info(`X-Road Base: ${this.xroadBase}`)
    const loginUrl = `${this.xroadBase}/r1/IS-DEV/GOV/10016/Syslumenn-Protected/StarfsKerfi/v1/Innskraning`

    // console.log('Logging in to Syslumenn at URL:', loginUrl)
    // this.logger.info('Logging in to Syslumenn at URL:', loginUrl)

    // console.log('Using Syslumenn username:', this.syslumennConfig.username)

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
        console.error(`Syslumenn login failed with status: ${response.status}`)
        console.error(`Syslumenn login failed with: ${response}`)
        this.logger.error(
          `Syslumenn login failed with status: ${response.status}`,
        )
        this.logger.error(`Syslumenn login failed with: ${response}`)
        throw new Error('Syslumenn login failed')
      }

      const data = await response.json()
      return data.accessToken
    } catch (error) {
      console.error(`Error during Syslumenn login: ${error}`)
      this.logger.error(`Error during Syslumenn login: ${error}`)
      throw error
    }
  }
}
