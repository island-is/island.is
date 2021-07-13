import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { CreateDraftRegulationInput } from './dto/createDraftRegulation.input'
import { DraftRegulationModel } from './models/draftRegulation.model'
import { CreateDraftRegulationModel } from './models/createDraftRegulation.model'
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
      : null
    console.log({ ministries })

    return {
      ...regulation,
      lawChapters: lawChapters,
      ministry: ministries?.[0],
      authors: [
        // TODO: Sækja úr X-road
        regulation?.authors.map((authorKt: String) => ({
          authorId: authorKt,
          name: 'Test name',
        })),
      ],
      idealPublishDate: regulation?.ideal_publish_date, // TODO: Exclude original from response.
      draftingNotes: regulation?.drafting_notes, // TODO: Exclude original from response.
      appendixes: [], // TODO: Add this.
      impacts: [], // TODO: Add this.
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

  @Mutation(() => graphqlTypeJson)
  // @Mutation(() => CreateDraftRegulationModel)
  async createDraftRegulation(
    @Args('input') input: CreateDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(input, authorization ?? '')
  }
}
