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
  RegulationRedirect,
  RegName,
} from '@island.is/clients/regulations'
import { GetRegulationsInput } from './dto/getRegulations.input'
import { GetRegulationInput } from './dto/getRegulation.input'
import { GetRegulationsLawChaptersInput } from './dto/getRegulationsLawChapters.input'
import { RegulationModel } from './model/regulation'
import { RegulationsModel } from './model/regulations'

const validPage = (page: number | undefined) => (page && page >= 1 ? page : 1)

@Resolver()
export class RegulationsResolver {
  constructor(private regulationsService: RegulationsService) {}

  // @Query(() => RegulationModel)
  @Query(() => graphqlTypeJson)
  getRegulation(
    @Args('input') input: GetRegulationInput,
  ): Promise<Regulation | RegulationRedirect | null> {
    return this.regulationsService.getRegulation(
      input.viewType,
      input.name as RegName,
      input.date as ISODate | undefined,
      input.isCustomDiff,
      input.earlierDate as ISODate | 'original' | undefined,
    )
  }

  // @Query(() => RegulationsModel)
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
  getRegulationsYears(): Promise<RegulationYears | null> {
    return this.regulationsService.getRegulationsYears()
  }

  @Query(() => graphqlTypeJson)
  getRegulationsMinistries(): Promise<RegulationMinistries | null> {
    return this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson)
  getRegulationsLawChapters(
    @Args('input') input: GetRegulationsLawChaptersInput,
  ): Promise<RegulationLawChapterTree | Array<RegulationLawChapter> | null> {
    return this.regulationsService.getRegulationsLawChapters(input.tree ?? true)
  }
}
