import { Inject, Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'

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
    applicationDto: ApplicationDto,
    url: string,
  ): Promise<boolean> {
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
        `Error acquiring access token for application ${applicationDto.id}: ${error}`,
      )
      return false
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
        body: JSON.stringify({
          applicationId: applicationDto.id,
          applicationType: applicationDto.slug,
        }),
      })

      if (!response.ok) {
        this.logger.error(
          `Non-OK response for application ${applicationDto.id}`,
        )
        return false
      }
    } catch (error) {
      this.logger.error(
        `Error sending notification for application ${applicationDto.id}: ${error}`,
      )
      return false
    }

    return true
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
