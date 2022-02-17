import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { Inject, UseGuards } from '@nestjs/common'
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
import { RegulationsAdminApi } from '../client'
import { RegulationsAdminClientService } from '@island.is/clients/regulations-admin'
import { DraftRegulationPdfDownload } from './models/draftRegulationPdfDownload.model'
import { ConfigType } from '@nestjs/config'
import { UpdateDraftRegulationCancelInput } from './dto/updateDraftRegulationCancel.input'
import { CreateDraftRegulationCancelInput } from './dto/createDraftRegulationCancel.input'
import { DraftRegulationCancelModel } from './models/draftRegulationCancel.model'

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

  // @Query(() => [DraftRegulationSummaryModel])
  @Query(() => graphqlTypeJson)
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return await this.regulationsAdminClientService.getShippedRegulations(
      authorization,
    )
  }

  // @Query(() => [DraftRegulationSummaryModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(@CurrentUser() user: User) {
    return await this.regulationsAdminClientService.getDraftRegulations(
      user.authorization,
    )
  }

  @Mutation(() => graphqlTypeJson)
  async createDraftRegulation(
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(authorization ?? '')
  }

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
    }
  }

  @Mutation(() => DraftRegulationCancelModel)
  async createDraftRegulationCancel(
    @Args('input') input: CreateDraftRegulationCancelInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationCancelModel> {
    return await this.regulationsAdminApiService.createDraftRegulationCancel(
      input,
      authorization ?? '',
    )
  }

  @Mutation(() => DraftRegulationCancelModel)
  async updateDraftRegulationCancel(
    @Args('input') input: UpdateDraftRegulationCancelInput,
    @CurrentUser() { authorization }: User,
  ): Promise<DraftRegulationCancelModel> {
    return await this.regulationsAdminApiService.updateDraftRegulationCancel(
      input,
      authorization ?? '',
    )
  }
}
