import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { GetDraftRegulationPdfDownloadInput } from './dto/downloadRegulation.input'
import { DeleteDraftRegulationInput } from './dto/deleteDraftRegulation.input'
import { EditDraftRegulationInput } from './dto/editDraftRegulation.input'
import { GetRegulationOptionListInput } from './dto/getRegulationOptionList.input'
import { DeleteDraftRegulationModel } from './models/deleteDraftRegulation.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import {
  RegulationsAdminApi,
  RegulationsAdminOptions,
  REGULATIONS_ADMIN_OPTIONS,
} from '../client/regulationsAdmin.api'
import { DraftRegulationPdfDownload } from './models/draftRegulationPdfDownload.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() user: User,
  ) {
    return await this.regulationsAdminApiService.getDraftRegulation(
      input.draftId,
      user.authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return await this.regulationsAdminApiService.getShippedRegulations(
      authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(@CurrentUser() user: User) {
    return await this.regulationsAdminApiService.getDraftRegulations(
      user.authorization,
    )
  }

  // @Mutation(() => CreateDraftRegulationModel)
  @Mutation(() => graphqlTypeJson)
  async createDraftRegulation(
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(authorization ?? '')
  }

  // @Mutation(() => CreateDraftRegulationModel)
  @Mutation(() => graphqlTypeJson)
  async updateDraftRegulationById(
    @Args('input') input: EditDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.updateById(
      input.id,
      input.body,
      authorization ?? '',
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulation(
    @Args('input') input: DeleteDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    await this.regulationsAdminApiService.deleteById(
      input.draftId,
      authorization ?? '',
    )

    return {
      id: input.draftId,
    }
  }

  // @Query(() => [RegulationOptionList])
  @Query(() => graphqlTypeJson)
  async getRegulationOptionList(
    @Args('input') input: GetRegulationOptionListInput,
    @CurrentUser() { authorization }: User,
  ) {
    return await this.regulationsService.getRegulationOptionList(input.names)
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsMinistries(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsLawChapters(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsLawChapters(false)
  }

  @Query(() => DraftRegulationPdfDownload)
  async getDraftRegulationPdfDownload(
    @Args('input') input: GetDraftRegulationPdfDownloadInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationPdfDownload | null> {
    // This is open to be extended with downloading published regulations as well

    if (!this.downloadServiceConfig.baseUrl) {
      console.warn('no downloadservice')
      return null
    }

    // FIXME: Find out a more lightweight way of checking if a `draftId` is valid.
    const draftRegulation = await this.regulationsAdminApiService.getDraftRegulation(
      input.draftId,
      authorization,
    )

    if (!draftRegulation) {
      return null
    }

    return {
      downloadService: true,
      url: `${this.downloadServiceConfig.baseUrl}/download/v1/regulation/draft/${input.draftId}`,
    }
  }
}
