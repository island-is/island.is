import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { RegulationsService } from '@island.is/clients/regulations'
import {
  RegulationSearchResults,
  RegulationYears,
  RegulationListItem,
} from '@island.is/regulations/web'
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
import { PresignedPost } from '@island.is/regulations/admin'

const validPage = (page: number | undefined) => (page && page >= 1 ? page : 1)

@Resolver()
export class RegulationsResolver {
  constructor(private regulationsService: RegulationsService) {}

  @Mutation(() => graphqlTypeJson)
  createPresignedPost(): Promise<PresignedPost | null> {
    return this.regulationsService.createPresignedPost()
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
  ): Promise<RegulationListItem[] | null> {
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
