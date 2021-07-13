import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
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
  constructor(private RegulationsAdminApiService: RegulationsAdminApi) {}

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ) {
    return this.RegulationsAdminApiService.getDraftRegulation(
      input.regulationId,
      authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return this.RegulationsAdminApiService.getShippedRegulations(authorization)
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(@CurrentUser() { authorization }: User) {
    return this.RegulationsAdminApiService.getDraftRegulations(authorization)
  }
}
