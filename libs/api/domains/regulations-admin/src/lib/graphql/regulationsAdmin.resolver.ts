import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { DownloadRegulationInput } from './dto/downloadRegulation.input'
import { DeleteDraftRegulationInput } from './dto/deleteDraftRegulation.input'
import { EditDraftRegulationInput } from './dto/editDraftRegulation.input'
import { DraftRegulationModel } from './models/draftRegulation.model'
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
import {
  Author,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraft,
  DraftSummary,
  ShippedSummary,
  RegulationPdfDownload,
} from '@island.is/regulations/admin'
import { extractAppendixesAndComments } from '@island.is/regulations-tools/textHelpers'
import { nameToSlug, PlainText, Appendix } from '@island.is/regulations'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
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

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsMinistries(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsLawChapters(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsLawChapters(false)
  }

  @Query(() => graphqlTypeJson)
  async downloadRegulation(
    @Args('input') input: DownloadRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<RegulationPdfDownload | null> {
    // This is open to be extended with downloading published regulations as well

    if (!this.options.downloadServiceUrl) {
      console.warn('no downloadservice')
      return null
    }

    const draftRegulation = await this.regulationsAdminApiService.getDraftRegulation(
      input.regulationId,
      authorization,
    )

    if (!draftRegulation) {
      return null
    }

    return {
      downloadService: true,
      url: `${this.options.downloadServiceUrl}/download/v1/regulation/draft/${input.regulationId}`,
    }
  }
}
