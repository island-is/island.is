import { Args, Query, Resolver } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { RegulationsService, Regulations, Regulation } from '@island.is/clients/regulations'
import { GetRegulationsNewestInput } from './dto/getRegulationsNewestInput'
import { GetRegulationOriginalInput } from './dto/getRegulationOriginalInput'

@Resolver()
export class RegulationsResolver {
  constructor(private regulationsService: RegulationsService) {}

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationOriginal(
    @Args('input') input: GetRegulationOriginalInput,
  ): Promise<Regulation | null> {
    return this.regulationsService.getRegulationOriginal(input?.regulationName ?? '')
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  getRegulationsNewest(
    @Args('input') input: GetRegulationsNewestInput,
  ): Promise<Regulations | null> {
    return this.regulationsService.getRegulationsNewest(input?.page ?? 1)
  }

}
