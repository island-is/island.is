import { Query, Resolver, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { DraftRegulationModel } from './models/draftRegulation.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { RegulationsAdminApi } from '../client/regulationsAdmin.api'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
  ) {}

  @Query(() => DraftRegulationModel, { nullable: true })
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ) {
    const regulation = await this.regulationsAdminApiService.getDraftRegulation(
      input.regulationId,
      authorization,
    )

    const lawChapters = regulation
      ? this.regulationsService.getRegulationsLawChapters(
          false,
          regulation.law_chapters,
        )
      : []
    console.log({lawChapters})

    const ministries = regulation
      ? this.regulationsService.getRegulationsMinistries([regulation.ministry])
      : ''
    console.log({ministries})

    return regulation
  }

  @Query(() => DraftRegulationModel, { nullable: true })
  async getShippedRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ) {
    const regulations = await this.regulationsAdminApiService.getShippedRegulation(
      input.regulationId,
      authorization,
    )

    return regulations
  }

  @Query(() => [DraftRegulationModel])
  async getDraftRegulations(@CurrentUser() { authorization }: User) {
    const regulations = await this.regulationsAdminApiService.getDraftRegulations(
      authorization,
    )

    return regulations
  }
}
