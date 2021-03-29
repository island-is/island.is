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
import { GetRegulationsNewestInput } from './dto/getRegulationsNewestInput'
import { GetRegulationOriginalInput } from './dto/getRegulationOriginalInput'
import { GetRegulationCurrentInput } from './dto/getRegulationCurrentInput'
import { GetRegulationByDateInput } from './dto/getRegulationByDateInput'
import { GetRegulationsYearsInput } from './dto/GetRegulationsYearsInput'
import { GetRegulationsMinistriesInput } from './dto/getRegulationsMinistriesInput'

const validPage = (page: number | undefined) => (page && page >= 1 ? page : 1)

@Resolver()
export class RegulationsResolver {
  constructor(private regulationsService: RegulationsService) {}

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationOriginal(
    @Args('input') input: GetRegulationOriginalInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulationOriginal(input.regulationName)
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationCurrent(
    @Args('input') input: GetRegulationCurrentInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulationCurrent(input.regulationName)
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationByDate(
    @Args('input') input: GetRegulationByDateInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulationByDate(
      input.regulationName,
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
}
