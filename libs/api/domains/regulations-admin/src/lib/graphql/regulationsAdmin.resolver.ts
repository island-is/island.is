import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { Inject, UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { RegulationsAdminApi } from '../client'
import { RegulationsAdminClientService } from '@island.is/clients/regulations-admin'
import { ConfigType } from '@nestjs/config'
import { RegulationViewTypes } from '@island.is/regulations/web'
import { nameToSlug } from '@island.is/regulations'
import {
  CreateDraftRegulationCancelInput,
  DeleteDraftRegulationInput,
  EditDraftRegulationInput,
  GetRegulationFromApiInput,
  GetDraftRegulationInput,
  GetDraftRegulationPdfDownloadInput,
  GetRegulationOptionListInput,
  UpdateDraftRegulationCancelInput,
  DeleteDraftRegulationCancelInput,
  DeleteDraftRegulationChangeInput,
  UpdateDraftRegulationChangeInput,
  CreateDraftRegulationChangeInput,
  GetDraftRegulationsInput,
  GetRegulationImpactsInput,
} from './dto'
import {
  DeleteDraftRegulationModel,
  DraftRegulationCancelModel,
  DraftRegulationChangeModel,
  DraftRegulationPdfDownloadModel,
  DraftRegulationSummaryModel,
  DraftRegulationShippedModel,
} from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
    private regulationsAdminClientService: RegulationsAdminClientService,
    @Inject(DownloadServiceConfig.KEY)
    private downloadServiceConfig: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() user: User,
  ) {
    return await this.regulationsAdminClientService.getDraftRegulation(
      input.draftId,
      user.authorization,
    )
  }

  @Query(() => graphqlTypeJson)
  async getRegulationImpactsByName(
    @Args('input') input: GetRegulationImpactsInput,
    @CurrentUser() user: User,
  ) {
    return await this.regulationsAdminApiService.getImpactsByName(
      input.regulation,
      user.authorization,
    )
  }

  @Query(() => [DraftRegulationShippedModel])
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return await this.regulationsAdminClientService.getShippedRegulations(
      authorization,
    )
  }

  // @Query(() => [DraftRegulationSummaryModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(
    @Args('input') input: GetDraftRegulationsInput,
    @CurrentUser() user: User,
  ) {
    return await this.regulationsAdminClientService.getDraftRegulations(
      user.authorization,
      input.page,
    )
  }

  @Mutation(() => graphqlTypeJson)
  async createDraftRegulation(
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(authorization)
  }

  @Mutation(() => graphqlTypeJson)
  async updateDraftRegulationById(
    @Args('input') input: EditDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.updateById(
      input.id,
      input.body,
      authorization,
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulation(
    @Args('input') input: DeleteDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DeleteDraftRegulationModel> {
    await this.regulationsAdminApiService.deleteById(
      input.draftId,
      authorization,
    )

    return {
      id: input.draftId,
    }
  }

  @Query(() => graphqlTypeJson)
  getRegulationFromApi(@Args('input') input: GetRegulationFromApiInput) {
    return this.regulationsService.getRegulationOnDate(
      input.date ? RegulationViewTypes.d : RegulationViewTypes.current,
      nameToSlug(input.regulation),
      input.date,
    )
  }

  @Query(() => graphqlTypeJson)
  async getRegulationOptionList(
    @Args('input') input: GetRegulationOptionListInput,
  ) {
    return await this.regulationsService.getRegulationOptionList(input.names)
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsMinistries() {
    return await this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsLawChapters() {
    return await this.regulationsService.getRegulationsLawChapters(false)
  }

  @Query(() => DraftRegulationPdfDownloadModel)
  async getDraftRegulationPdfDownload(
    @Args('input') input: GetDraftRegulationPdfDownloadInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationPdfDownloadModel | null> {
    // This is open to be extended with downloading published regulations as well

    if (!this.downloadServiceConfig.baseUrl) {
      console.warn('no downloadservice')
      return null
    }

    // FIXME: Find out a more lightweight way of checking if a `draftId` is valid.
    const draftRegulation = await this.regulationsAdminClientService.getDraftRegulation(
      input.draftId,
      authorization,
    )

    if (!draftRegulation) {
      return null
    }

    return {
      downloadService: true,
      url: `${this.downloadServiceConfig.baseUrl}/download/v1/regulation/draft/${input.draftId}`,
      //url: `https://regulationsadmin-deploy-api.dev01.devland.is/download/v1/regulation/draft/${input.draftId}`,
    }
  }

  @Mutation(() => DraftRegulationCancelModel)
  async createDraftRegulationCancel(
    @Args('input') input: CreateDraftRegulationCancelInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationCancelModel> {
    return await this.regulationsAdminApiService.createDraftRegulationCancel(
      input,
      authorization,
    )
  }

  @Mutation(() => DraftRegulationCancelModel)
  async updateDraftRegulationCancel(
    @Args('input') input: UpdateDraftRegulationCancelInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationCancelModel> {
    return await this.regulationsAdminApiService.updateDraftRegulationCancel(
      input,
      authorization,
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulationCancel(
    @Args('input') input: DeleteDraftRegulationCancelInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DeleteDraftRegulationModel> {
    await this.regulationsAdminApiService.deleteDraftRegulationCancel(
      input,
      authorization,
    )

    return {
      id: input.id,
    }
  }

  @Mutation(() => DraftRegulationChangeModel)
  async createDraftRegulationChange(
    @Args('input') input: CreateDraftRegulationChangeInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationChangeModel> {
    return await this.regulationsAdminApiService.createDraftRegulationChange(
      input,
      authorization,
    )
  }

  @Mutation(() => DraftRegulationChangeModel)
  async updateDraftRegulationChange(
    @Args('input') input: UpdateDraftRegulationChangeInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationChangeModel> {
    return await this.regulationsAdminApiService.updateDraftRegulationChange(
      input,
      authorization,
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulationChange(
    @Args('input') input: DeleteDraftRegulationChangeInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DeleteDraftRegulationModel> {
    await this.regulationsAdminApiService.deleteDraftRegulationChange(
      input,
      authorization,
    )

    return {
      id: input.id,
    }
  }
}
