import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { AssetTest } from './assets.types'

export const ASSET_OPTIONS = 'ASSET_OPTIONS'

export interface AssetServiceOptions {
  url?: string
  username?: string
  password?: string
  ttl?: number
}

export class AssetService extends RESTDataSource {
  constructor(
    @Inject(ASSET_OPTIONS)
    private readonly options: AssetServiceOptions,
  ) {
    super()
    this.baseURL = `${this.options.url}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async getRealEstates(): Promise<AssetTest | null> {
    const response = await this.get<AssetTest | null>('/fasteignir', {
      // Need api info
      cacheOptions: { ttl: this.options.ttl ?? 600 },
    })
    return response
  }

  async getRealEstateDetail(assetId: string): Promise<AssetTest | null> {
    const response = await this.get<AssetTest | null>(
      `/fasteignir/${assetId}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 },
      },
    )
    return response
  }
}
