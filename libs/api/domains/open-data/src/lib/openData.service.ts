import { Injectable } from '@nestjs/common'
import { Dataset, OpenDataClientService } from '@island.is/clients/open-data'
import {
  OpenDataDatasetsResponse,
  OpenDataDataset,
  OpenDataFilter,
  OpenDataPublisher,
} from './graphql/models'
import { GetOpenDataDatasetsInput } from './graphql/dto'

@Injectable()
export class OpenDataService {
  constructor(private readonly openDataClient: OpenDataClientService) {}

  async getDatasets(
    input: GetOpenDataDatasetsInput,
  ): Promise<OpenDataDatasetsResponse> {
    const response = await this.openDataClient.getDatasets({
      searchQuery: input.searchQuery,
      categories: input.categories,
      publishers: input.publishers,
      formats: input.formats,
      page: input.page,
      limit: input.limit,
    })

    return {
      datasets: response.datasets.map((d: Dataset) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        category: d.category,
        publisher: d.publisher,
        publisherId: d.publisherId,
        organizationImage: d.organizationImage,
        lastUpdated: d.lastUpdated,
        format: d.format,
        tags: d.tags,
        downloadUrl: d.downloadUrl,
        metadata: d.metadata,
      })),
      total: response.total,
      page: response.page,
      limit: response.limit,
      hasMore: response.hasMore,
    }
  }

  async getDataset(id: string): Promise<OpenDataDataset | null> {
    const dataset = await this.openDataClient.getDataset(id)
    if (!dataset) return null

    return {
      id: dataset.id,
      title: dataset.title,
      description: dataset.description,
      category: dataset.category,
      publisher: dataset.publisher,
      publisherId: dataset.publisherId,
      organizationImage: dataset.organizationImage,
      lastUpdated: dataset.lastUpdated,
      format: dataset.format,
      tags: dataset.tags,
      downloadUrl: dataset.downloadUrl,
      metadata: dataset.metadata,
      license: dataset.license,
      maintainer: dataset.maintainer,
      maintainerEmail: dataset.maintainerEmail,
      author: dataset.author,
      authorEmail: dataset.authorEmail,
      resources: dataset.resources,
    }
  }

  async getFilters(): Promise<OpenDataFilter[]> {
    return this.openDataClient.getFilters()
  }

  async getPublishers(): Promise<OpenDataPublisher[]> {
    return this.openDataClient.getPublishers()
  }
}
