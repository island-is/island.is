import { Inject, Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

@Injectable()
export class NotifyService {
  constructor(
    @Inject(XRoadConfig.KEY)
    private readonly xRoadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
  private readonly xroadBase = this.xRoadConfig.xRoadBasePath
  private readonly xroadClient = this.xRoadConfig.xRoadClient

  async sendNotification(
    applicationDto: ApplicationDto,
    url: string,
  ): Promise<boolean> {
    if (!this.xroadBase || !this.xroadClient) {
      throw new Error(
        'X-Road configuration is missing for NotifyService. Please check environment variables.',
      )
    }

    const xRoadPath = `${this.xroadBase}/r1/${url}`

    console.log('Sending notification to URL:', xRoadPath)
    this.logger.info('Sending notification to URL:', xRoadPath)

    try {
      const response = await fetch(xRoadPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Road-Client': this.xroadClient,
        },
        body: JSON.stringify({
          applicationId: applicationDto.id,
          applicationType: applicationDto.slug,
        }),
      })

      console.log(`Response Status: ${response.status}`)
      console.log(`Response Body:`, await response.text())
      this.logger.info(`Response Status: ${response.status}`)
      this.logger.info(`Response Body:`, await response.text())
      if (!response.ok) {
        return false
      }
    } catch (error) {
      console.error(`Error sending notification ${error}`)
      this.logger.error(`Error sending notification ${error}`)
      return false
    }

    return true
  }
}
