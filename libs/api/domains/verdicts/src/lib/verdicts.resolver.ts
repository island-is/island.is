import { Args, Query, Resolver } from '@nestjs/graphql'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { VerdictsService } from './verdicts.service'
import { VerdictByIdResponse, VerdictsResponse } from './dto/verdicts.response'
import { VerdictsInput } from './dto/verdicts.input'
import { VerdictByIdInput } from './dto/verdictById.input'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class VerdictsResolver {
  constructor(private readonly verdictsService: VerdictsService) {}

  @CacheControl(defaultCache)
  @Query(() => VerdictsResponse, {
    name: 'webVerdicts',
  })
  async verdicts(
    @Args('input') input: VerdictsInput,
  ): Promise<VerdictsResponse> {
    return this.verdictsService.getVerdicts(input)
  }

  @CacheControl(defaultCache)
  @Query(() => VerdictByIdResponse, {
    name: 'webVerdictById',
  })
  async verdictById(
    @Args('input') input: VerdictByIdInput,
  ): Promise<VerdictByIdResponse | null> {
    return this.verdictsService.getVerdictById(input)
  }
}
