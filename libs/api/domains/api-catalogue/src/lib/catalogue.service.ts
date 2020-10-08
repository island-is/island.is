import { Injectable } from '@nestjs/common'
import { ApiCatalogue, ApiService } from './models/catalogue.model'
import { GetApiCatalogueInput } from './dto/catalogue.input'
import { ElasticService } from '@island.is/api-catalogue/elastic'
import { RestMetadataService } from '@island.is/api-catalogue/services'
import { GetOpenApiInput } from './dto/openapi.input'
import { OpenApi } from './models/openapi.model'

@Injectable()
export class ApiCatalogueService {
  constructor(
    private readonly elastic: ElasticService,
    private readonly restMetadataService: RestMetadataService,
  ) {}

  async getCatalogue(input: GetApiCatalogueInput): Promise<ApiCatalogue> {
    const res: ApiCatalogue = {
      services: [],
      pageInfo: {
        nextCursor: null,
      },
    }
    //Set the search after parameter as an empty array since it will be ignored in elastic
    let searchAfter = []
    const { limit, cursor, query, pricing, data, type, access } = input

    if (typeof cursor !== 'undefined' && cursor !== null) {
      const temp = Buffer.from(input.cursor, 'base64').toString()
      searchAfter = temp.split(',')
    }

    const { body } = await this.elastic.fetchAll(
      limit,
      searchAfter,
      query,
      pricing,
      data,
      type,
      access,
    )

    //check if we have more available then was asked for
    if (body?.hits?.hits.length > limit) {
      //remove the unwanted result
      body?.hits?.hits.pop()
      //get the sort parameters of the last item to use as the cursor for next search
      searchAfter = body?.hits?.hits[body?.hits?.hits.length - 1].sort
      res.pageInfo.nextCursor = Buffer.from(searchAfter.toString()).toString(
        'base64',
      )
    }

    body?.hits?.hits.forEach((x) => res.services.push(x._source))

    return res
  }

  async getApiServiceById(id: string): Promise<ApiService> {
    const { body } = await this.elastic.fetchById(id)
    if (body?.hits?.total.value > 0) {
      return body?.hits?.hits[0]._source
    }

    return null
  }

  async getOpenApi(input: GetOpenApiInput): Promise<OpenApi> {
    const openApi = new OpenApi()
    openApi.spec = await this.restMetadataService.getOpenApiString({
      instance: input.instance,
      memberClass: input.memberClass,
      memberCode: input.memberCode,
      subsystemCode: input.subsystemCode,
      serviceCode: input.serviceCode,
    })

    return openApi
  }
}
