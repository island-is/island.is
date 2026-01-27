import { Args, Query, Resolver } from '@nestjs/graphql'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { VerdictsService } from './verdicts.service'
import { VerdictByIdResponse, VerdictsResponse } from './dto/verdicts.response'
import { VerdictsInput } from './dto/verdicts.input'
import { VerdictByIdInput } from './dto/verdictById.input'
import { KeywordsResponse } from './dto/keywords.response'
import { CourtAgendasResponse } from './dto/courtAgendas.response'
import { CourtAgendasInput } from './dto/courtAgendas.input'
import { LawyersResponse } from './dto/lawyers.response'
import { CaseFilterOptionsResponse } from './dto/caseFilterOptions.response'
import { ScheduleTypesResponse } from './dto/scheduleTypes.response'

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
    nullable: true,
  })
  async verdictById(
    @Args('input') input: VerdictByIdInput,
  ): Promise<VerdictByIdResponse | null> {
    return this.verdictsService.getVerdictById(input)
  }

  @CacheControl(defaultCache)
  @Query(() => CaseFilterOptionsResponse, {
    name: 'webVerdictCaseFilterOptionsPerCourt',
  })
  async caseFilterOptionsPerCourt(): Promise<CaseFilterOptionsResponse> {
    return this.verdictsService.getCaseFilterOptionsPerCourt()
  }

  @CacheControl(defaultCache)
  @Query(() => KeywordsResponse, {
    name: 'webVerdictKeywords',
  })
  async keywords(): Promise<KeywordsResponse> {
    return this.verdictsService.getKeywords()
  }

  @CacheControl(defaultCache)
  @Query(() => CourtAgendasResponse, {
    name: 'webCourtAgendas',
  })
  async courtAgendas(
    @Args('input') input: CourtAgendasInput,
  ): Promise<CourtAgendasResponse> {
    return this.verdictsService.getCourtAgendas(input)
  }

  @CacheControl(defaultCache)
  @Query(() => LawyersResponse, {
    name: 'webVerdictLawyers',
  })
  async lawyers(): Promise<LawyersResponse> {
    return this.verdictsService.getLawyers()
  }

  @CacheControl(defaultCache)
  @Query(() => ScheduleTypesResponse, {
    name: 'webCourtScheduleTypes',
  })
  async scheduleTypes(): Promise<ScheduleTypesResponse> {
    return this.verdictsService.getScheduleTypes()
  }
}
