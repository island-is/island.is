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
import { RegulationsAdminClientService } from '@island.is/clients/regulations-admin'
import { ConfigType } from '@nestjs/config'
import { RegulationViewTypes } from '@island.is/regulations/web'
import { ensureRegName, nameToSlug } from '@island.is/regulations'
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
  DraftRegulationShippedModel,
} from './models'
import { CreateDraftRegulationInput } from './dto/createDraftRegulation.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminClientService: RegulationsAdminClientService,
    @Inject(DownloadServiceConfig.KEY)
    private downloadServiceConfig: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() user: User,
  ) {
    return await this.regulationsAdminClientService.getDraftRegulation(
      input.draftId,
      user,
    )
  }

  @Query(() => graphqlTypeJson)
  async getRegulationImpactsByName(
    @Args('input') input: GetRegulationImpactsInput,
    @CurrentUser() user: User,
  ) {
    return ensureRegName(input.regulation)
      ? await this.regulationsAdminClientService.getImpactsByName(
          input.regulation,
          user,
        )
      : null
  }

  @Query(() => [DraftRegulationShippedModel])
  async getShippedRegulations(@CurrentUser() user: User) {
    return await this.regulationsAdminClientService.getShippedRegulations(user)
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulations(
    @Args('input') input: GetDraftRegulationsInput,
    @CurrentUser() user: User,
  ) {
    return await this.regulationsAdminClientService.getDraftRegulations(
      user,
      input.page,
    )
  }

  @Mutation(() => graphqlTypeJson)
  async createDraftRegulation(
    @Args('input') input: CreateDraftRegulationInput,
    @CurrentUser() auth: User,
  ) {
    return this.regulationsAdminClientService.create(auth, input)
  }

  @Mutation(() => graphqlTypeJson)
  async updateDraftRegulationById(
    @Args('input') input: EditDraftRegulationInput,
    @CurrentUser() auth: User,
  ) {
    return this.regulationsAdminClientService.updateById(
      input.id,
      input.body,
      auth,
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulation(
    @Args('input') input: DeleteDraftRegulationInput,
    @CurrentUser() auth: User,
  ): Promise<DeleteDraftRegulationModel> {
    await this.regulationsAdminClientService.deleteById(input.draftId, auth)

    return {
      id: input.draftId,
    }
  }

  @Query(() => graphqlTypeJson)
  async getRegulationFromApi(@Args('input') input: GetRegulationFromApiInput) {
    return ensureRegName(input.regulation)
      ? await this.regulationsService.getRegulationOnDate(
          input.date ? RegulationViewTypes.d : RegulationViewTypes.current,
          nameToSlug(input.regulation),
          input.date,
        )
      : null
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
    @CurrentUser() user: User,
  ): Promise<DraftRegulationPdfDownloadModel | null> {
    // This is open to be extended with downloading published regulations as well

    if (!this.downloadServiceConfig.baseUrl) {
      console.warn('no downloadservice')
      return null
    }

    const draftRegulation =
      await this.regulationsAdminClientService.getDraftRegulation(
        input.draftId,
        user,
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
    @CurrentUser() auth: User,
  ): Promise<DraftRegulationCancelModel> {
    return await this.regulationsAdminClientService.createDraftRegulationCancel(
      input,
      auth,
    )
  }

  @Mutation(() => DraftRegulationCancelModel)
  async updateDraftRegulationCancel(
    @Args('input') input: UpdateDraftRegulationCancelInput,
    @CurrentUser() auth: User,
  ): Promise<DraftRegulationCancelModel> {
    return await this.regulationsAdminClientService.updateDraftRegulationCancel(
      input,
      auth,
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulationCancel(
    @Args('input') input: DeleteDraftRegulationCancelInput,
    @CurrentUser() auth: User,
  ): Promise<DeleteDraftRegulationModel> {
    await this.regulationsAdminClientService.deleteDraftRegulationCancel(
      input,
      auth,
    )

    return {
      id: input.id,
    }
  }

  @Mutation(() => DraftRegulationChangeModel)
  async createDraftRegulationChange(
    @Args('input') input: CreateDraftRegulationChangeInput,
    @CurrentUser() auth: User,
  ): Promise<DraftRegulationChangeModel> {
    return await this.regulationsAdminClientService.createDraftRegulationChange(
      input,
      auth,
    )
  }

  @Mutation(() => DraftRegulationChangeModel)
  async updateDraftRegulationChange(
    @Args('input') input: UpdateDraftRegulationChangeInput,
    @CurrentUser() auth: User,
  ): Promise<DraftRegulationChangeModel> {
    const { id, ...update } = input
    return await this.regulationsAdminClientService.updateDraftRegulationChange(
      update,
      id,
      auth,
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulationChange(
    @Args('input') input: DeleteDraftRegulationChangeInput,
    @CurrentUser() auth: User,
  ): Promise<DeleteDraftRegulationModel> {
    await this.regulationsAdminClientService.deleteDraftRegulationChange(
      input.id,
      auth,
    )

    return {
      id: input.id,
    }
  }
}
