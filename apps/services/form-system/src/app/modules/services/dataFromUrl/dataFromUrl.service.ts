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

    console.log('Requesting data from URL with request body:', request)

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

      console.log('responseData:', responseData)
    } catch (error) {
      this.logger.error(`Error fetching data from URL ${url}: ${error}`)
      return { isError: true }
    }

    const response = new DataFromUrlResDto()
    response.placeholder = {
      is: 'Veldu gildi úr listanum',
      en: 'Select a value from the list',
    }

    response.list = [
      {
        id: '1',
        label: {
          is: 'Galdrakarlinn í Oz 1',
          en: 'The Wizard of Oz 1',
        },
        value: '',
        displayOrder: 0,
        isSelected: false,
      },
      {
        id: '1',
        label: {
          is: 'Galdrakarlinn í Oz 2',
          en: 'The Wizard of Oz 2',
        },
        value: '',
        displayOrder: 0,
        isSelected: true,
      },
      {
        id: '1',
        label: {
          is: 'Galdrakarlinn í Oz 3',
          en: 'The Wizard of Oz 3',
        },
        value: '',
        displayOrder: 0,
        isSelected: false,
      },
    ]
    return response
  }
}
