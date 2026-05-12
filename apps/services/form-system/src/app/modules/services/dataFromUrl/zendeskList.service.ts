import { Injectable, Inject } from '@nestjs/common'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { FieldSettings } from '@/app/dataTypes/fieldSettings/fieldSettings.model'
import { DataFromUrlReqDto } from '../../applications/models/dto/dataFromUrl.request.dto'
import { DataFromUrlResDto } from '../../applications/models/dto/dataFromUrl.response.dto'
import { ListTypesEnum } from '@island.is/form-system/shared'
import { LanguageType } from '../../../dataTypes/languageType.model'

@Injectable()
export class ZendeskListService {
  enhancedFetch: EnhancedFetchAPI

  private readonly TENANT_ID = 'digitaliceland'
  // private readonly TENANT_ID =
  //   process.env.FORM_SYSTEM_ZENDESK_TENANT_ID_PROD ?? 'digitaliceland'

  private readonly API_KEY = process.env.FORM_SYSTEM_ZENDESK_API_KEY_PROD

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
    const zendeskInstance = this.TENANT_ID
    // if (!zendeskInstance) {
    //   this.logger.error(
    //     `No Zendesk instance configuration found for tenant ${this.TENANT_ID}`,
    //   )
    //   throw new Error(
    //     `No Zendesk instance configuration found for tenant ${this.TENANT_ID}`,
    //   )
    // }

    let url = ''
    const contactEmail = 'stafraentisland@gmail.com'
    const username = `${contactEmail}/token`
    const credentials = Buffer.from(`${username}:${this.API_KEY}`).toString(
      'base64',
    )

    if (fieldSettings.listType === ListTypesEnum.ZENDESK_CUSTOM_OBJECT) {
      const customObjectKey = fieldSettings.zendeskCustomObjectKey
      const zendeskUrl = `https://${zendeskInstance}.zendesk.com`
      // url = `${zendeskUrl}/api/v2/custom_objects/test_gogn/records?page[size]=100`
      url = `${zendeskUrl}/api/v2/custom_objects/${customObjectKey}/records?page[size]=100`
      // const placeholderUrl = `${zendeskUrl}/api/v2/custom_objects/test_gogn/fields`
      const placeholderUrl = `${zendeskUrl}/api/v2/custom_objects/${customObjectKey}`
      const placeholder = await this.getCustomObjectPlaceholder(
        placeholderUrl,
        credentials,
      )

      const listResult = await this.fetchAllPages(url, credentials)
      listResult.placeholder = placeholder
      return listResult
    }

    const ticketFieldId = fieldSettings.zendeskTicketFieldId
    const zendeskUrl = `https://${zendeskInstance}.zendesk.com`
    url = `${zendeskUrl}/api/v2/ticket_fields/${ticketFieldId}`

    // const brandId = '30220057411090'
    // console.log('fieldSettings:', fieldSettings)
    // const ticketFieldId = fieldSettings.zendeskTicketFieldId
    // console.log('ticketFieldId:', ticketFieldId)
    // const zendeskUrl = `https://${zendeskInstance}.zendesk.com`
    // url = `${zendeskUrl}/api/v2/ticket_fields/${ticketFieldId}`

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

      let result = new DataFromUrlResDto()

      if (fieldSettings.listType === ListTypesEnum.ZENDESK_FIELD_OPTIONS) {
        const data: ZendeskFieldOptionsResponse = await response.json()

        result.list = data.ticket_field.custom_field_options.map((option) => ({
          id: '1',
          displayOrder: 0,
          label: { is: option.name, en: option.name },
          value: option.value,
          isSelected: option.default,
        }))
        result.placeholder = {
          is: data.ticket_field.title,
          en: data.ticket_field.title,
        }
      } else if (
        fieldSettings.listType === ListTypesEnum.ZENDESK_CUSTOM_OBJECT
      ) {
        const data: ZendeskCustomObjectResponse = await response.json()

        result.list = data.custom_object_records.map((record) => ({
          id: '1',
          displayOrder: 0,
          label: { is: record.name, en: record.name },
          value: record.name,
          isSelected: false,
        }))

        console.log('Zendesk custom object response data:', data)
      }

      // const data: ZendeskFieldOptionsResponse = await response.json()
      // console.log('Zendesk API response data:', data.ticket_field.title)

      // const result = new DataFromUrlResDto()
      // result.list = data.ticket_field.custom_field_options.map((option) => ({
      //   id: '1',
      //   displayOrder: 0,
      //   label: { is: option.name, en: option.name },
      //   value: option.value,
      //   isSelected: option.default,
      // }))
      // result.placeholder = {
      //   is: data.ticket_field.title,
      //   en: data.ticket_field.title,
      // }

      return result
    } catch (error) {
      this.logger.error(`Error fetching list from Zendesk: ${error}`)
      return { isError: true }
    }
  }

  private async getCustomObjectPlaceholder(
    url: string,
    credentials: string,
  ): Promise<LanguageType> {
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
          `Failed to fetch custom object placeholder from Zendesk. Status: ${response.status}, StatusText: ${response.statusText}`,
        )
        throw new Error(
          `Failed to fetch custom object placeholder from Zendesk. Status: ${response.status}`,
        )
      }

      const data = await response.json()
      console.log('Zendesk custom object placeholder response data:', data)
      if (data.custom_object && data.custom_object.title) {
        console.log('Custom object fields:', data.custom_object_fields)

        return { is: data.custom_object.title, en: data.custom_object.title }
      }

      return { is: '', en: '' }
    } catch (error) {
      this.logger.error(
        `Error fetching custom object placeholder from Zendesk: ${error}`,
      )
      return { is: '', en: '' }
    }
  }

  private async fetchAllPages(
    url: string,
    credentials: string,
  ): Promise<DataFromUrlResDto> {
    let records: any[] = []
    let nextUrl: string | null = url

    while (nextUrl) {
      const response = await this.enhancedFetch(nextUrl, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        this.logger.error(
          `Failed to fetch data from Zendesk. Status: ${response.status}, StatusText: ${response.statusText}`,
        )
        throw new Error(
          `Failed to fetch data from Zendesk. Status: ${response.status}`,
        )
      }

      // const data = await response.json()
      const data: ZendeskCustomObjectResponse = await response.json()
      records = records.concat(data.custom_object_records)

      nextUrl = data.meta.has_more ? data.links?.next ?? null : null
    }

    console.log(`length of records fetched from Zendesk: ${records.length}`)

    const result = new DataFromUrlResDto()

    result.list = records.map((record) => ({
      id: '1',
      displayOrder: 0,
      label: { is: record.name, en: record.name },
      value: record.name,
      isSelected: false,
    }))

    console.log(`result list length: ${result.list?.length}`)
    return result
  }
}

interface ZendeskCustomObjectResponse {
  custom_object_records: Array<{ id: string; name: string }>
  meta: { has_more: boolean; after_cursor?: string }
  links?: { next?: string; prev?: string }
}

interface ZendeskFieldOptionsResponse {
  ticket_field: {
    title: string
    custom_field_options: Array<{
      name: string
      value: string
      default: boolean
    }>
  }
}
