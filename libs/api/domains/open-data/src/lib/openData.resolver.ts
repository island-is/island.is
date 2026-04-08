import { Resolver, Query, Args, ID } from '@nestjs/graphql'
import { OpenDataService } from './openData.service'
import {
  OpenDataDatasetsResponse,
  OpenDataDataset,
  OpenDataFilter,
  OpenDataPublisher,
} from './graphql/models'
import { GetOpenDataDatasetsInput } from './graphql/dto'

@Resolver()
export class OpenDataResolver {
  constructor(private readonly openDataService: OpenDataService) {}

  @Query(() => OpenDataDatasetsResponse, { name: 'openDataDatasets' })
  async getDatasets(
    @Args('input') input: GetOpenDataDatasetsInput,
  ): Promise<OpenDataDatasetsResponse> {
    return this.openDataService.getDatasets(input)
  }

  @Query(() => OpenDataDataset, { name: 'openDataDataset', nullable: true })
  async getDataset(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<OpenDataDataset | null> {
    return this.openDataService.getDataset(id)
  }

  @Query(() => [OpenDataFilter], { name: 'openDataFilters' })
  async getFilters(): Promise<OpenDataFilter[]> {
    return this.openDataService.getFilters()
  }

  @Query(() => [OpenDataPublisher], { name: 'openDataPublishers' })
  async getPublishers(): Promise<OpenDataPublisher[]> {
    return this.openDataService.getPublishers()
  }
}
