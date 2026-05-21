import { Inject, Injectable } from '@nestjs/common'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { BodyRequestDto } from '../models/body.request.dto'
import { FieldSettings } from '@/app/dataTypes/fieldSettings/fieldSettings.model'
import { DataFromUrlReqDto } from '../../applications/models/dto/dataFromUrl.request.dto'
import { DataFromUrlResDto } from '../../applications/models/dto/dataFromUrl.response.dto'
import { AuthService } from '../auth.service'
import { ListItemDto } from '../../listItems/models/dto/listItem.dto'

@Injectable()
export class DataFromUrlService {
  enhancedFetch: EnhancedFetchAPI

  constructor(
    private readonly authService: AuthService,
    @Inject(XRoadConfig.KEY)
    private readonly xRoadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.enhancedFetch = createEnhancedFetch({
      name: 'form-system-data-from-url-service',
      organizationSlug: 'stafraent-island',
      timeout: 40000,
      logErrorResponseBody: true,
    })
  }
  private readonly xroadBase = this.xRoadConfig.xRoadBasePath
  private readonly xroadClient = this.xRoadConfig.xRoadClient

  async getDataFromUrl(
    fieldSettings: FieldSettings,
    dataFromUrlRequestDto: DataFromUrlReqDto,
  ): Promise<DataFromUrlResDto> {
    const url = fieldSettings.dataSourceUrl
    if (!url) {
      throw new Error('No data source URL configured for this field')
    }
    if (!this.xroadBase || !this.xroadClient) {
      throw new Error(
        `X-Road configuration is missing for DataFromUrlService. Please check environment variables.`,
      )
    }
    let accessToken = ''
    let audkenni = ''
    try {
      const loginResponse = await this.authService.getAccessToken(url)
      accessToken = loginResponse.accessToken
      audkenni = loginResponse.audkenni
    } catch (error) {
      this.logger.error(`Error acquiring login tokens: ${error}`)
    }

    const request: BodyRequestDto = {
      dataRequest: dataFromUrlRequestDto,
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
        body: JSON.stringify(request),
      })

      const responseData = await response.json()
      const resultList = new DataFromUrlResDto()
      resultList.placeholder = responseData?.placeholder ?? null

      resultList.list = responseData.list.map((item: ListItemDto) => ({
        ...(typeof item === 'object' && item !== null ? item : {}),
        id: '1',
        displayOrder: 0,
      }))

      resultList.isError = Boolean(responseData?.isError)

      return resultList
    } catch (error) {
      this.logger.error(`Error fetching data from URL ${url}: ${error}`)
      const resultList = new DataFromUrlResDto()
      resultList.isError = true
      return resultList
    }
  }
}
