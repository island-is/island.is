import graphqlTypeJson from 'graphql-type-json'
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

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ) {
    const regulation = await this.regulationsAdminApiService.getDraftRegulation(
      input.regulationId,
      authorization,
    )

    const lawChapters = regulation
      ? await this.regulationsService.getRegulationsLawChapters(
          false,
          regulation.law_chapters,
        )
      : []
    console.log({ lawChapters })

    const ministries = regulation
      ? await this.regulationsService.getRegulationsMinistries([
          regulation.ministry_id,
        ])
      : ''
    console.log({ ministries })

    return {
      ...regulation,
      lawChapters: lawChapters,
      ministry: ministries?.[0],
    }
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
  async getDraftRegulations(@CurrentUser() { authorization }: User) {
    const regulations = await this.regulationsAdminApiService.getDraftRegulations(
      authorization,
    )

    return regulations
  }
}
