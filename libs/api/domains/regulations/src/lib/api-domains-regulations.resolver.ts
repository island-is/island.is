import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  RegulationSearchResults,
  RegulationYears,
} from '@island.is/regulations/web'
import { Audit } from '@island.is/nest/audit'
import {
  Regulation,
  RegulationDiff,
  RegulationRedirect,
  MinistryList,
  LawChapter,
  LawChapterTree,
} from '@island.is/regulations'
import { GetRegulationsInput } from './dto/getRegulations.input'
import { GetRegulationInput } from './dto/getRegulation.input'
import { GetRegulationsLawChaptersInput } from './dto/getRegulationsLawChapters.input'
import { GetRegulationsMinistriesInput } from './dto/getRegulationsMinistriesInput.input'
import { GetRegulationsSearchInput } from './dto/getRegulationsSearch.input'
import { CreateRegulationPresignedPostInput } from './dto/createPresignedPost.input'
import { PresignedPostResults } from '@island.is/regulations/admin'

const validPage = (page: number | undefined) => (page && page >= 1 ? page : 1)
@Audit({ namespace: '@island.is/api/regulations' })
@Resolver()
export class RegulationsResolver {
  constructor(private regulationsService: RegulationsService) {}

  @Audit()
  @UseGuards(IdsUserGuard, ScopesGuard)
  @Mutation(() => graphqlTypeJson, { name: 'regulationCreatePresignedPost' })
  createPresignedPost(
    @Args('input') input: CreateRegulationPresignedPostInput,
  ): Promise<PresignedPostResults | null> {
    return this.regulationsService.createPresignedPost(
      input.fileName,
      input.regId,
      input.hash,
    )
  }

  @Query(() => graphqlTypeJson)
  getRegulation(
    @Args('input') input: GetRegulationInput,
  ): Promise<Regulation | RegulationDiff | RegulationRedirect | null> {
    return this.regulationsService.getRegulation(
      input.viewType,
      input.name,
      input.date,
      input.isCustomDiff,
      input.earlierDate,
    )
  }

  @Query(() => graphqlTypeJson)
  getRegulations(
    @Args('input') input: GetRegulationsInput,
  ): Promise<RegulationSearchResults | null> {
    return this.regulationsService.getRegulations(
      input.type,
      validPage(input.page),
    )
  }

  @Query(() => graphqlTypeJson)
  getRegulationsSearch(
    @Args('input') input: GetRegulationsSearchInput,
  ): Promise<RegulationSearchResults | null> {
    return this.regulationsService.getRegulationsSearch(
      input.q,
      input.rn,
      input.year,
      input.yearTo,
      input.ch,
      input.iA,
      input.iR,
      input.page,
    )
  }

  @Query(() => graphqlTypeJson)
  getRegulationsOptionSearch(@Args('input') input: GetRegulationsSearchInput) {
    return this.regulationsService.getRegulationsOptionSearch(
      input.q,
      input.rn,
      input.year,
      input.yearTo,
      input.ch,
      input.iA,
      input.iR,
      input.page,
    )
  }

  @Query(() => graphqlTypeJson)
  getRegulationsYears(): Promise<RegulationYears | null> {
    return this.regulationsService.getRegulationsYears()
  }

  @Query(() => graphqlTypeJson)
  getRegulationsMinistries(
    @Args('input') input: GetRegulationsMinistriesInput,
  ): Promise<MinistryList | null> {
    return this.regulationsService.getRegulationsMinistries(input.slugs)
  }

  @Query(() => graphqlTypeJson)
  getRegulationsLawChapters(
    @Args('input') input: GetRegulationsLawChaptersInput,
  ): Promise<LawChapterTree | Array<LawChapter> | null> {
    return this.regulationsService.getRegulationsLawChapters(
      input.tree ?? (input.slugs ? false : true),
      input.slugs,
    )
  }
}
