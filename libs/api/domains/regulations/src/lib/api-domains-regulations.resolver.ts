import { Args, Query, Resolver } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import {
  RegulationsService,
  RegulationSearchResults,
  Regulation,
  ISODate,
  RegulationMinistries,
  RegulationYears,
  RegulationLawChapter,
  RegulationLawChapterTree,
} from '@island.is/clients/regulations'
import { GetRegulationsInput } from './dto/getRegulations.input'
import { GetRegulationInput } from './dto/getRegulation.input'
import { GetRegulationsYearsInput } from './dto/GetRegulationsYears.input'
import { GetRegulationsMinistriesInput } from './dto/getRegulationsMinistries.input'
import { GetRegulationsLawChaptersInput } from './dto/getRegulationsLawChapters.input'
import { RegulationModel } from './model/regulation'
import { RegulationsModel } from './model/regulations'

const validPage = (page: number | undefined) => (page && page >= 1 ? page : 1)

@Resolver()
export class RegulationsResolver {
  constructor(private regulationsService: RegulationsService) {}

  @Query(() => RegulationModel)
  getRegulation(
    @Args('input') input: GetRegulationInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulation(
      input.viewType,
      input.name,
      input.date,
    )
  }

  @Query(() => RegulationsModel)
  getRegulations(
    @Args('input') input: GetRegulationsInput,
  ): Promise<RegulationSearchResults | null> {
    return this.regulationsService.getRegulations(
      input.type,
      validPage(input.page),
    )
  }

  @Query(() => graphqlTypeJson)
  getRegulationsYears(
    @Args('input') input: GetRegulationsYearsInput,
  ): Promise<RegulationYears | null> {
    return this.regulationsService.getRegulationsYears(input.year)
  }

  @Query(() => graphqlTypeJson)
  getRegulationsMinistries(
    @Args('input') input: GetRegulationsMinistriesInput,
  ): Promise<RegulationMinistries | null> {
    return this.regulationsService.getRegulationsMinistries(input.slug)
  }

  @Query(() => graphqlTypeJson)
  getRegulationsLawChapters(
    @Args('input') input: GetRegulationsLawChaptersInput,
  ): Promise<RegulationLawChapterTree | Array<RegulationLawChapter> | null> {
    return this.regulationsService.getRegulationsLawChapters(input.tree ?? true)
  }
}
