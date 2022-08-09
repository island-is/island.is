import { ElectronicRegistrationsClientService } from '@island.is/clients/electronic-registrations'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { GetBrokwnDownRegistrationStatisticsInput } from './dto/getBrokenDownRegistrationStatistics.input'
import { BrokenDownRegistrationStatistic } from './models/brokenDownRegistrationStatistic'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class HeilbrigdisstofnunNordurlandsResolver {
  constructor(
    private readonly heilbrigdisstofnunNordurlandsClientService: ElectronicRegistrationsClientService,
  ) {}

  @Directive(cacheControlDirective())
  @Query(() => [BrokenDownRegistrationStatistic])
  getBrokenDownRegistrationStatistics(
    @Args('input') input: GetBrokwnDownRegistrationStatisticsInput,
  ) {
    return this.heilbrigdisstofnunNordurlandsClientService.getBrokenDownRegistrationStatistics(
      input,
    )
  }
}
