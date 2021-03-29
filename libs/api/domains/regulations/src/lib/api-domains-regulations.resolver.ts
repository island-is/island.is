import { Args, Query, Resolver } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import {
  RegulationsService,
  RegulationSearchResults,
  Regulation,
  ISODate,
  RegulationMinistries,
  RegulationYears,
} from '@island.is/clients/regulations'
import { GetRegulationsNewestInput } from './dto/getRegulationsNewest.input'
import { GetRegulationOriginalInput } from './dto/getRegulationOriginal.input'
import { GetRegulationCurrentInput } from './dto/getRegulationCurrent.input'
import { GetRegulationByDateInput } from './dto/getRegulationByDate.input'
import { GetRegulationsYearsInput } from './dto/GetRegulationsYears.input'
import { GetRegulationsMinistriesInput } from './dto/getRegulationsMinistries.input'
import { GetRegulationsLawChaptersInput } from './dto/getRegulationsLawChapters.input'

const validPage = (page: number | undefined) => (page && page >= 1 ? page : 1)

@Resolver()
export class RegulationsResolver {
  constructor(private regulationsService: RegulationsService) {}

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationOriginal(
    @Args('input') input: GetRegulationOriginalInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulationOriginal(input.name)
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationCurrent(
    @Args('input') input: GetRegulationCurrentInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulationCurrent(input.name)
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationByDate(
    @Args('input') input: GetRegulationByDateInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulationByDate(
      input.name,
      input.date as ISODate,
    )
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationsNewest(
    @Args('input') input: GetRegulationsNewestInput,
  ): Promise<RegulationSearchResults | null> {
    return this.regulationsService.getRegulationsNewest(validPage(input.page))
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationsYears(
    @Args('input') input: GetRegulationsYearsInput,
  ): Promise<RegulationYears | null> {
    return this.regulationsService.getRegulationsYears()
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationsMinistries(
    @Args('input') input: GetRegulationsMinistriesInput,
  ): Promise<RegulationMinistries | null> {
    return this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationsLawChapters(
    @Args('input') input: GetRegulationsLawChaptersInput,
  ): Promise<RegulationMinistries | null> {
    return this.regulationsService.getRegulationsLawChapters()
  }
}
