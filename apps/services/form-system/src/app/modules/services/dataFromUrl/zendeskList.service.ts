import { Injectable, Inject } from '@nestjs/common'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { FieldSettings } from '@/app/dataTypes/fieldSettings/fieldSettings.model'
import { DataFromUrlReqDto } from '../../applications/models/dto/dataFromUrl.request.dto'
import { DataFromUrlResDto } from '../../applications/models/dto/dataFromUrl.response.dto'

@Injectable()
export class ZendeskListService {
  enhancedFetch: EnhancedFetchAPI
  private readonly SANDBOX_TENANT_ID =
    process.env.FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX ??
    'digitaliceland1715002531'
  private readonly PROD_TENANT_ID =
    process.env.FORM_SYSTEM_ZENDESK_TENANT_ID_PROD ?? 'digitaliceland'
  private readonly SANDBOX_API_KEY =
    process.env.FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX
  private readonly PROD_API_KEY = process.env.FORM_SYSTEM_ZENDESK_API_KEY_PROD

  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.enhancedFetch = createEnhancedFetch({
      name: 'form-system-zendesk-list-service',
      organizationSlug: 'stafraent-island',
      timeout: 40000,
      logErrorResponseBody: true,
    })
  }

  async getListFromZendesk(
    fieldSettings: FieldSettings,
    dataFromUrlRequestDto: DataFromUrlReqDto,
  ): Promise<DataFromUrlResDto> {
    // const zendeskInstance = ZENDESK_INSTANCES[this.TENANT_ID]
    const zendeskInstance = this.SANDBOX_TENANT_ID

    // if (!zendeskInstance) {
    //   this.logger.error(
    //     `No Zendesk instance configuration found for tenant ${this.TENANT_ID}`,
    //   )
    //   throw new Error(
    //     `No Zendesk instance configuration found for tenant ${this.TENANT_ID}`,
    //   )
    // }

    const brandId = '30220057411090'
    console.log('fieldSettings:', fieldSettings)
    const ticketFieldId = fieldSettings.zendeskTicketFieldId
    console.log('ticketFieldId:', ticketFieldId)
    const zendeskUrl = `https://${zendeskInstance}.zendesk.com`
    const url = `${zendeskUrl}/api/v2/ticket_fields/${ticketFieldId}`

    const contactEmail = 'stafraentisland@gmail.com'
    const username = `${contactEmail}/token`
    const credentials = Buffer.from(
      `${username}:${this.SANDBOX_API_KEY}`,
    ).toString('base64')

    try {
      const response = await this.enhancedFetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        this.logger.error(
          `Failed to fetch ticket fields from Zendesk. Status: ${response.status}, StatusText: ${response.statusText}`,
        )
        throw new Error(
          `Failed to fetch ticket fields from Zendesk. Status: ${response.status}`,
        )
      }

      const data = await response.json()
      console.log('Zendesk API response data:', data)

      return new DataFromUrlResDto()
    } catch (error) {
      this.logger.error(`Error fetching list from Zendesk: ${error}`)
      return { isError: true }
    }
  }
}
